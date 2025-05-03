import { Separator } from "@/components/ui/separator";

export default function WhatToDoSection() {
	return (
			<div className="w-full py-10 px-4">
				{/* Heading */}
				<h2 className="text-3xl font-extrabold text-center mb-2">What To Do?</h2>
	
				{/* Top Horizontal Separator */}
				<Separator className="mb-8 border" />
	
				{/* Centered Responsive layout */}
				<div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto">
					{/* Section 1 */}
					<div className="flex flex-col flex-1 px-6 space-y-4">
						<h3 className="text-2xl font-semibold text-center md:text-left">
							Implement Your Schedule
						</h3>
						<ol className="list-decimal pl-6 space-y-2 text-base text-muted-foreground">
							<li>Create your shifts</li>
							<li>Specify what days the shifts are repeated</li>
							<li>
								Add expertise to shifts needing professional attention (e.g.
								cashier can open)
							</li>
						</ol>
					</div>
	
					{/* Vertical Separator */}
					<div className="hidden md:flex items-stretch">
						<Separator orientation="vertical" className="mx-4 h-auto border" />
					</div>
	
					{/* Section 2 */}
					<div className="flex flex-col flex-1 px-6 space-y-4 mt-6 md:mt-0">
						<h3 className="text-2xl font-semibold text-center md:text-left">
							Invite Employees
						</h3>
						<ol className="list-decimal pl-6 space-y-2 text-base text-muted-foreground">
							<li>Invite your employees</li>
							<li>Await their response</li>
							<li>Add expertise to employees (e.g. cashier to open)</li>
						</ol>
					</div>
	
					{/* Vertical Separator */}
					<div className="hidden md:flex items-stretch">
						<Separator orientation="vertical" className="mx-4 h-auto border" />
					</div>
	
					{/* Section 3 */}
					<div className="flex flex-col flex-1 px-6 space-y-4 mt-6 md:mt-0">
						<h3 className="text-2xl font-semibold text-center md:text-left">
							Generate a Schedule
						</h3>
						<ol className="list-decimal pl-6 space-y-2 text-base text-muted-foreground">
							<li>Go to calendar</li>
							<li>View your shift structure</li>
							<li>Pick a week and click generate</li>
							<li>Lock assignments or click accept – that’s it!</li>
						</ol>
					</div>
				</div>
			</div>
		);
}
