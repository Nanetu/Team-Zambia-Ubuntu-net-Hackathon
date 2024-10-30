"use client";

import React, { useState } from "react";
import { Book, ChevronRight, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Dialog from "@/components/ui/dialog";

// Types
interface Concept {
	title: string;
	content: string;
}

const ConceptPage: React.FC = () => {
	const router = useRouter();
	const [selectedCourse, setSelectedCourse] = useState("");
	const [selectedTopic, setSelectedTopic] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedConcept, setSelectedConcept] = useState<Concept>({
		title: "",
		content: "",
	});

	const courses = ["Physics"];
	const topics = {
		Physics: ["Waves", "Capacitance", "Optics", "Electrostatics"],
	};

	const keyConcepts: Concept[] = [
		{
			title: "Understanding Mole Ratios in Chemical Equations",
			content:
				"The mole ratio is a conversion factor that expresses the relationship between the amounts in moles of any two compounds involved in a chemical reaction.",
		},
		{
			title: "Von Neumann Architecture Explained",
			content:
				"The von Neumann architecture is a computer architecture based on the stored-program computer concept, where program data and instruction data are stored in the same memory.",
		},
		{
			title: "Memory Paging in Operating Systems",
			content:
				"Paging is a memory management scheme that eliminates the need for contiguous allocation of physical memory and thus reduces memory fragmentation.",
		},
	];

	const handleConceptClick = (concept: Concept) => {
		setSelectedConcept(concept);
		setIsDialogOpen(true);
	};

	const handleGenerateConcepts = () => {
		console.log("Generating concepts for:", selectedCourse, selectedTopic);
	};

	return (
		<div className="p-6 max-w-6xl mx-auto">
			<div className="bg-white rounded-lg shadow-sm p-6 mb-8">
				<h2 className="text-2xl font-semibold mb-6">Generate Key Concepts</h2>
				<div className="grid grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Select Course
						</label>
						<select
							value={selectedCourse}
							onChange={(e) => {
								setSelectedCourse(e.target.value);
								setSelectedTopic("");
							}}
							className="w-full border rounded-lg px-3 py-2"
						>
							<option value="">Select a course...</option>
							{courses.map((course) => (
								<option key={course} value={course}>
									{course}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Select Topic
						</label>
						<select
							value={selectedTopic}
							onChange={(e) => setSelectedTopic(e.target.value)}
							className="w-full border rounded-lg px-3 py-2"
							disabled={!selectedCourse}
						>
							<option value="">Select a topic...</option>
							{selectedCourse &&
								topics[selectedCourse as keyof typeof topics].map((topic) => (
									<option key={topic} value={topic}>
										{topic}
									</option>
								))}
						</select>
					</div>
				</div>
				<button
					onClick={handleGenerateConcepts}
					disabled={!selectedCourse || !selectedTopic}
					className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Generate Concepts
				</button>
			</div>

			<div className="bg-white rounded-lg shadow-sm p-6">
				<h2 className="text-2xl font-semibold mb-6">Key Concepts</h2>
				<div className="space-y-4">
					{keyConcepts.map((concept, index) => (
						<div
							key={index}
							className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
							onClick={() => handleConceptClick(concept)}
						>
							<div className="flex items-center gap-3">
								<Book className="text-blue-600" size={24} />
								<span className="font-medium">{concept.title}</span>
							</div>
							<ChevronRight className="text-gray-400" size={20} />
						</div>
					))}
				</div>
			</div>

			<Dialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				title={selectedConcept.title}
			>
				<p className="text-gray-700 leading-relaxed">
					{selectedConcept.content}
				</p>
			</Dialog>
		</div>
	);
};

export default ConceptPage;
