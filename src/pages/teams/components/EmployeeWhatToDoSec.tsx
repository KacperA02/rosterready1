import { Separator } from "@/components/ui/separator";

export default function EmployeeWhatToDoSection() {
	return (
		<div className="w-full py-10 px-4 md:px-12 lg:px-24">
			{/* Heading */}
			<h2 className="text-4xl font-extrabold text-center mb-6">What To Do?</h2>

			{/* Top Horizontal Separator */}
			<Separator className="mb-8" />

			{/* Responsive layout */}
			<div className="flex flex-col md:flex-row w-full">
				{/* Section 1 */}
				<div className="flex flex-col flex-1 px-4 space-y-4">
					<h3 className="text-2xl font-semibold text-center md:text-left">
						Implement Your Availability
					</h3>
					<ol className="list-decimal pl-6 space-y-2 text-base text-muted-foreground">
						<li>Click on account → "My Availability"</li>
						<li>Create a new availability</li>
						<li>Await response from employer</li>
					</ol>
				</div>

				{/* Vertical Separator */}
				<div className="hidden md:flex items-stretch">
					<Separator orientation="vertical" className="mx-6 h-auto" />
				</div>

				{/* Section 2 */}
				<div className="flex flex-col flex-1 px-4 space-y-4 mt-6 md:mt-0">
					<h3 className="text-2xl font-semibold text-center md:text-left">
						Check Your Calendar
					</h3>
					<ol className="list-decimal pl-6 space-y-2 text-base text-muted-foreground">
						<li>Click on Calendar</li>
						<li>View your upcoming weeks</li>
						<li>Check if your roster has been placed for any weeks</li>
						<li>
							Don't see it? Don't worry! It hasn't been published yet. You will
							be notified when the employer generates it.
						</li>
					</ol>
				</div>
			</div>
		</div>
	);
}
