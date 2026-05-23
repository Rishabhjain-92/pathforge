const User = require("../models/User");

// Role requirements database
const roleRequirements = {
  "Software Engineer": {
    skills: ["DSA", "System Design", "JavaScript", "React", "Node.js", "MongoDB", "Git", "REST APIs", "Docker", "AWS"],
    description: "Full-stack software engineer at top tech companies"
  },
  "Frontend Developer": {
    skills: ["React", "JavaScript", "TypeScript", "CSS", "HTML", "Tailwind CSS", "Redux", "Next.js", "Git", "Figma"],
    description: "Frontend specialist focused on UI/UX"
  },
  "Backend Developer": {
    skills: ["Node.js", "Express.js", "MongoDB", "PostgreSQL", "REST APIs", "Docker", "AWS", "Redis", "System Design", "Git"],
    description: "Backend specialist focused on APIs and databases"
  },
  "Full Stack Developer": {
    skills: ["React", "Node.js", "MongoDB", "JavaScript", "TypeScript", "REST APIs", "Git", "Docker", "AWS", "System Design"],
    description: "End-to-end web application developer"
  },
  "Data Scientist": {
    skills: ["Python", "Machine Learning", "Deep Learning", "Pandas", "NumPy", "scikit-learn", "TensorFlow", "SQL", "Statistics", "Data Visualization"],
    description: "Data science and machine learning specialist"
  },
  "ML Engineer": {
    skills: ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "MLOps", "Docker", "AWS", "SQL", "FastAPI"],
    description: "Machine learning model development and deployment"
  },
  "DevOps Engineer": {
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Git", "Terraform", "Ansible", "Monitoring", "Shell Scripting"],
    description: "Infrastructure and deployment automation"
  },
  "Android Developer": {
    skills: ["Kotlin", "Java", "Android SDK", "Jetpack Compose", "REST APIs", "Firebase", "Git", "MVVM", "Room Database", "Coroutines"],
    description: "Native Android application development"
  },
  "Cloud Engineer": {
    skills: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Linux", "Networking", "Security", "CI/CD"],
    description: "Cloud infrastructure and services specialist"
  },
};

// Company specific additional requirements
const companyBonus = {
  "Google": ["System Design", "DSA", "Distributed Systems", "Scalability"],
  "Microsoft": ["DSA", "System Design", "Azure", "C#"],
  "Amazon": ["DSA", "System Design", "AWS", "Leadership Principles"],
  "Meta": ["DSA", "System Design", "React", "GraphQL"],
  "Apple": ["DSA", "System Design", "Swift", "Objective-C"],
  "Flipkart": ["DSA", "System Design", "Java", "Microservices"],
  "Swiggy": ["DSA", "Node.js", "System Design", "Microservices"],
  "Zomato": ["DSA", "React", "Node.js", "System Design"],
  "Razorpay": ["DSA", "Node.js", "Security", "Payments"],
  "CRED": ["DSA", "Kotlin", "System Design", "Android"],
};

const calculateReadinessScore = (userSkills, targetRole, targetCompany) => {
  const roleData = roleRequirements[targetRole] ||
    roleRequirements["Software Engineer"];

  let requiredSkills = [...roleData.skills];

  // Add company specific skills
  if (targetCompany && companyBonus[targetCompany]) {
    companyBonus[targetCompany].forEach(skill => {
      if (!requiredSkills.includes(skill)) {
        requiredSkills.push(skill);
      }
    });
  }

  // Calculate matches
  const userSkillsLower = userSkills.map(s => s.toLowerCase());
  const matchedSkills = requiredSkills.filter(s =>
    userSkillsLower.includes(s.toLowerCase())
  );

  return Math.round((matchedSkills.length / requiredSkills.length) * 100);
};

const getSkillGap = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const userSkills = user.skills || [];
    const targetRole = user.targetRole || "Software Engineer";
    const targetCompany = user.targetCompany || "";

    // Get required skills for role
    const roleData = roleRequirements[targetRole] ||
      roleRequirements["Software Engineer"];

    let requiredSkills = [...roleData.skills];

    // Add company specific skills
    if (targetCompany && companyBonus[targetCompany]) {
      companyBonus[targetCompany].forEach(skill => {
        if (!requiredSkills.includes(skill)) {
          requiredSkills.push(skill);
        }
      });
    }

    // Calculate matches
    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    const matchedSkills = requiredSkills.filter(s =>
      userSkillsLower.includes(s.toLowerCase())
    );
    const missingSkills = requiredSkills.filter(s =>
      !userSkillsLower.includes(s.toLowerCase())
    );

    const readinessScore = calculateReadinessScore(userSkills, targetRole, targetCompany);

    // Update readiness score in DB
    await User.findByIdAndUpdate(req.user.id, { readinessScore });

    res.status(200).json({
      success: true,
      data: {
        targetRole,
        targetCompany,
        userSkills,
        requiredSkills,
        matchedSkills,
        missingSkills,
        readinessScore,
        totalRequired: requiredSkills.length,
        totalMatched: matchedSkills.length,
        roleDescription: roleData.description,
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getSkillGap, calculateReadinessScore };