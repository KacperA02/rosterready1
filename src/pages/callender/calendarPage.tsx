import React, { useState, useEffect } from "react";
import CalendarComponent from "./components/calendarComp";
import { fetchShifts } from "../shifts/services/ShiftService";
import {
	fetchAllSolutions,
	fetchSingleSolution,
} from "./services/AssignmentService";
import { ShiftEvent } from "@/types/shift";
import { Solution, SolutionAssignment } from "@/types/solution";
import { useRoles } from "@/hooks/useRoles";
const CalendarPage: React.FC = () => {
	// Check if the user is an employer
	const { isEmployer } = useRoles();
	// State to store events to display in the calendar component
	const [viewEvents, setViewEvents] = useState<ShiftEvent[]>([]);

	// State to trigger calendar refresh when changed
	const [refreshCalendar, setRefreshCalendar] = useState(false);

	// function to get the start of the week based on a given date
	const getStartOfWeek = (date: Date): Date => {
		const startOfWeek = new Date(date);
		const day = startOfWeek.getDay();
		const diff = day === 0 ? 6 : day - 1;
		startOfWeek.setDate(startOfWeek.getDate() - diff);
		startOfWeek.setHours(0, 0, 0, 0);
		return startOfWeek;
	};

	// function to get the specific day of the week based on a given date and day ID, needed to be implemented as day_ids were different in db compared to react-big-calendar
	const getDayOfWeek = (weekStartDate: Date, dayId: number): Date | null => {
		if (dayId < 1 || dayId > 7) return null; 
		const date = new Date(weekStartDate);
		const dayOffset = dayId - 1;
		date.setDate(weekStartDate.getDate() + dayOffset);
		return date;
	};

	// useEffect to load events when the component mounts or refreshCalendar changes
	// This effect fetches all solutions and shifts, processes them, and sets the events for the calendar
	useEffect(() => {
		const loadEvents = async () => {
			// Stores solution-based events
			const solutionEvents: ShiftEvent[] = [];

			// Tracks weeks that already have solutions
			// set is a function that allows to store unique values of any type, in this case, we are using it to store the weeks that already have solutions
			const filledWeeks = new Set<string>();

			// Fetch all solutions (scheduled weeks with assigned shifts)
			const allSolutions: Solution[] = await fetchAllSolutions();

			// Loops through each solution to extract relevant shift events
			for (const solution of allSolutions) {
				const startDate = new Date(solution.week.start_date);
				const startDateStr = getStartOfWeek(startDate)
					.toISOString()
					.split("T")[0];

				// request to fetch assignments for the current solution
				const assignments: SolutionAssignment[] | null =
					await fetchSingleSolution(solution.id);
				if (solution.status === "DRAFT" && !isEmployer()) {
					continue;
				}
				if (!assignments) continue;

				// adding the start date of the week to the filledWeeks set to avoid duplicates
				filledWeeks.add(startDateStr);

				// Group assignments by shift and day
				const groupedAssignments: { [key: string]: SolutionAssignment[] } = {};
				// foreach loop to iterate through each assignment and group them by shift and day
				assignments.forEach((assignment: SolutionAssignment) => {
					if (!assignment.shift || !assignment.day) return;
					const key = `${assignment.shift.id}-${assignment.day.id}`;
					if (!groupedAssignments[key]) {
						groupedAssignments[key] = [];
					}
					groupedAssignments[key].push(assignment);
				});

				// object.keys to iterate through the grouped assignments and create events for each shift
				Object.keys(groupedAssignments).forEach((key) => {
					const assignmentsForKey = groupedAssignments[key];
					const firstAssignment = assignmentsForKey[0];
					const shift = firstAssignment.shift;
					const dayId = firstAssignment.day?.id;
					if (!dayId || !shift) return;
					// variables to store the start date of the week and the start date of the day
					const weekStart = getStartOfWeek(startDate);
					const dayStart = getDayOfWeek(weekStart, dayId);
					if (!dayStart) return;

					// Set start and end times for the shift
					const [startHour, startMinute] = shift.time_start
						.split(":")
						.map(Number);
					const [endHour, endMinute] = shift.time_end.split(":").map(Number);
					dayStart.setHours(startHour, startMinute, 0);

					const visualEnd = new Date(dayStart);
					const trueEnd = new Date(dayStart);
					trueEnd.setHours(endHour, endMinute, 0);

					const endsAfterMidnight =
						endHour < startHour ||
						(endHour === startHour && endMinute < startMinute);

					if (endsAfterMidnight) {
						visualEnd.setHours(23, 59, 0); // set visual end to 23:59
					} else {
						visualEnd.setHours(endHour, endMinute, 0); // normal end
					}

					// Collect user info assigned to this shift
					const users = assignmentsForKey.map((a) => ({
						first_name: a.user?.first_name ?? "Not",
						last_name: a.user?.last_name ?? "Generated",
					}));
					// Add shift event to the list
					solutionEvents.push({
						id: shift.id,
						assignment_id: firstAssignment.assignment_id,
						start: dayStart,
						end: visualEnd,
						trueEnd,
						title: shift.name,
						no_of_users: assignmentsForKey.length,
						users,
						locked: firstAssignment.locked,
						isGenerated: true,
						solution_id: solution.id,
						status: solution.status,
					});
				});
			}

			// Stores fallback (unscheduled) shift events
			const fallbackEvents: ShiftEvent[] = [];

			// Fetch all shifts (regardless of assignment)
			const allShifts = await fetchShifts();

			// Define the range to display fallback events (next 24 weeks)
			const today = new Date();
			const twentyFourWeeksLater = new Date();
			twentyFourWeeksLater.setMonth(today.getMonth() + 6);

			// Generate fallback events for shifts without a solution
			allShifts.forEach((shift) => {
				shift.days.forEach((day) => {
					let currentDate = new Date(today);
					while (currentDate <= twentyFourWeeksLater) {
						const weekStartStr = getStartOfWeek(currentDate)
							.toISOString()
							.split("T")[0];
						if (filledWeeks.has(weekStartStr)) {
							currentDate.setDate(currentDate.getDate() + 7);
							continue;
						}

						const [startHour, startMinute] = shift.time_start
							.split(":")
							.map(Number);
						const [endHour, endMinute] = shift.time_end.split(":").map(Number);
						const weekStart = getStartOfWeek(currentDate);
						const dayStart = getDayOfWeek(weekStart, day.id);
						if (!dayStart) return;

						dayStart.setHours(startHour, startMinute, 0);

						const visualEnd = new Date(dayStart);
						const trueEnd = new Date(dayStart);
						trueEnd.setHours(endHour, endMinute, 0);

						const endsAfterMidnight =
							endHour < startHour ||
							(endHour === startHour && endMinute < startMinute);

						if (endsAfterMidnight) {
							visualEnd.setHours(23, 59, 0);
						} else {
							visualEnd.setHours(endHour, endMinute, 0);
						}

						// Add the fallback shift event
						fallbackEvents.push({
							id: shift.id,
							start: dayStart,
							end: visualEnd,
							assignment_id:undefined,
							trueEnd,
							title: shift.name,
							no_of_users: shift.no_of_users,
							users: undefined,
							isGenerated: false,
							solution_id: undefined,
							status: undefined,
						});

						// Move to the next week
						currentDate.setDate(currentDate.getDate() + 7);
					}
				});
			});

			// Combine solution-based and fallback events into the final view
			setViewEvents([...solutionEvents, ...fallbackEvents]);
		};

		// Trigger the load function
		loadEvents();
	}, [refreshCalendar]);

	// Render the calendar component with events
	return (
		<div>
			<h2>View Calendar</h2>
			{/* passing events to the calendar component */}
			<CalendarComponent
				events={viewEvents}
				selectable={false}
				setRefreshCalendar={setRefreshCalendar}
			/>
		</div>
	);
};

export default CalendarPage;
