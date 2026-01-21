export const SYLLABUS_DATA: Record<string, { title: string, description: string }[]> = {
    // Maths
    "Maths-Basic": [
        { title: "Shapes and Space", description: "Understanding basic 2D shapes." },
        { title: "Numbers from One to Nine", description: "Counting and number recognition." },
        { title: "Addition", description: "Basic addition up to 20." },
        { title: "Subtraction", description: "Basic subtraction up to 20." },
        { title: "Patterns", description: "Identifying simple patterns." }
    ],
    "Maths-Intermediate": [
        { title: "Building with Bricks", description: "3D shapes and patterns." },
        { title: "Long and Short", description: "Measurement concepts." },
        { title: "A Trip to Bhopal", description: "Time, distance, and money." },
        { title: "Tick-Tick-Tick", description: "Reading clocks and time." },
        { title: "The Junk Seller", description: "Money and profit/loss basics." }
    ],
    "Maths-Advanced": [
        { title: "Integers", description: "Properties of addition and subtraction." },
        { title: "Fractions and Decimals", description: "Operations on fractions." },
        { title: "Data Handling", description: "Mean, median, mode, and bar graphs." },
        { title: "Simple Equations", description: "Solving for x." },
        { title: "Lines and Angles", description: "Geometry fundamentals." }
    ],

    // Science
    "Science-Basic": [
        { title: "What is around us?", description: "Living and non-living things." },
        { title: "Plants Types", description: "Herbs, shrubs, and trees." },
        { title: "Animals and their food", description: "Herbivores, carnivores, omnivores." },
        { title: "Our Body", description: "Parts of the body and their functions." },
        { title: "Water", description: "Sources and uses of water." }
    ],
    "Science-Intermediate": [
        { title: "Food: Where does it come from?", description: "Plant parts and animal products." },
        { title: "Components of Food", description: "Nutrients and balanced diet." },
        { title: "Fibre to Fabric", description: "Natural vs synthetic fibres." },
        { title: "Sorting Materials into Groups", description: "Properties of materials." },
        { title: "Separation of Substances", description: "Methods of separation." }
    ],
    "Science-Advanced": [
        { title: "Nutrition in Plants", description: "Photosynthesis and modes of nutrition." },
        { title: "Acids, Bases and Salts", description: "Chemical properties and indicators." },
        { title: "Physical and Chemical Changes", description: "Rusting, crystallization, etc." },
        { title: "Respiration in Organisms", description: "Breathing vs respiration." },
        { title: "Electric Current and its Effects", description: "Circuits and symbols." }
    ],

    // Default fallback
    "Default": [
        { title: "Chapter 1", description: "Introduction to the subject." },
        { title: "Chapter 2", description: "Core concepts part 1." },
        { title: "Chapter 3", description: "Core concepts part 2." },
        { title: "Chapter 4", description: "Advanced applications." },
        { title: "Chapter 5", description: "Summary and projects." }
    ]
};

export const getSyllabus = (subject: string, grade: number) => {
    let level = "Basic";
    if (grade >= 4 && grade <= 6) level = "Intermediate";
    if (grade >= 7) level = "Advanced";

    const key = `${subject}-${level}`;
    return SYLLABUS_DATA[key] || SYLLABUS_DATA["Default"];
};
