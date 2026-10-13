/**
 * Round 2 Shortlisted Candidates Constant Data
 * Content and Photography candidate lists provided for Round 2 Results.
 */

export const getBranchFromRoll = (roll) => {
  if (!roll) return "";
  const codeMatch = roll.toUpperCase().match(/2026U([A-Z]{2})/);
  if (!codeMatch) return "";
  const code = codeMatch[1];
  const branchMap = {
    CS: "Computer Science",
    IT: "Information Technology",
    EC: "Electronics & Comm.",
    CD: "CS (Data Analytics)",
    EE: "Electrical Engineering",
    IC: "Instrumentation & Control",
    CM: "Mathematics & Computing",
    EV: "ECAM / VLSI",
    BD: "Bachelor of Design",
    ME: "Mechanical Engineering",
    BT: "Biotechnology",
    CE: "Civil Engineering",
    CA: "CS (Artificial Intelligence)",
    BA: "Management Studies",
  };
  return branchMap[code] || code;
};

export const round2StaticCandidates = [
  // ================= CONTENT (49 Candidates) =================
  { name: "Aarush", rollNumber: "2026UCS1545", department: "Content", branch: "Computer Science" },
  { name: "Abhinav Tomar", rollNumber: "2026UIT2861", department: "Content", branch: "Information Technology" },
  { name: "Akshara Gupta", rollNumber: "2026UBA9037", department: "Content", branch: "Management Studies" },
  { name: "Akshit Garg", rollNumber: "2026UEC2863", department: "Content", branch: "Electronics & Comm." },
  { name: "Ananya Poddar", rollNumber: "2026UCS1671", department: "Content", branch: "Computer Science" },
  { name: "Angel", rollNumber: "2026UCD2126", department: "Content", branch: "CS (Data Analytics)" },
  { name: "Ankush Singh", rollNumber: "2026UCD1944", department: "Content", branch: "CS (Data Analytics)" },
  { name: "Anshika Gupta", rollNumber: "2026UEE3578", department: "Content", branch: "Electrical Engineering" },
  { name: "Arman Dubb", rollNumber: "2026UIC3544", department: "Content", branch: "Instrumentation & Control" },
  { name: "Aryan Gangwar", rollNumber: "2026UCM2340", department: "Content", branch: "Mathematics & Computing" },
  { name: "Atharva Parashar", rollNumber: "2026UEV2807", department: "Content", branch: "ECAM / VLSI" },
  { name: "Avishi Naagar", rollNumber: "2026UBD9715", department: "Content", branch: "Bachelor of Design" },
  { name: "Avni Mahajan", rollNumber: "2026UCS1552", department: "Content", branch: "Computer Science" },
  { name: "Avni Singla", rollNumber: "2026UEE4216", department: "Content", branch: "Electrical Engineering" },
  { name: "Daksh", rollNumber: "2026UIT3027", department: "Content", branch: "Information Technology" },
  { name: "Evika Jain", rollNumber: "2026UME1088", department: "Content", branch: "Mechanical Engineering" },
  { name: "Gaurang Chauhan", rollNumber: "2026UME4159", department: "Content", branch: "Electronics & Comm." },
  { name: "Ishaan Babuta", rollNumber: "2026UBA9032", department: "Content", branch: "Management Studies" },
  { name: "Kakul Verma", rollNumber: "2026UEE4507", department: "Content", branch: "Electrical Engineering" },
  { name: "Kartik Kumar", rollNumber: "2026UIT3335", department: "Content", branch: "Information Technology" },
  { name: "Khayanshu Kumar", rollNumber: "2026UCS1525", department: "Content", branch: "Computer Science" },
  { name: "Madhvika Sharma", rollNumber: "2026UBT1071", department: "Content", branch: "Biotechnology" },
  { name: "Mannat Vig", rollNumber: "2026UBA9112", department: "Content", branch: "Management Studies" },
  { name: "Mayank Yadav", rollNumber: "2026UEE4639", department: "Content", branch: "Electrical Engineering" },
  { name: "Mishka Goyal", rollNumber: "2026UBA9098", department: "Content", branch: "Management Studies" },
  { name: "Neevi", rollNumber: "2026UIC4179", department: "Content", branch: "Instrumentation & Control" },
  { name: "Prabhakar", rollNumber: "2026UEC2819", department: "Content", branch: "Electronics & Comm." },
  { name: "Prabhjot Singh", rollNumber: "2026UBD9780", department: "Content", branch: "Bachelor of Design" },
  { name: "Pranav Vats", rollNumber: "2026UIT3029", department: "Content", branch: "Information Technology" },
  { name: "Rishi Vats", rollNumber: "2026UBD9767", department: "Content", branch: "Bachelor of Design" },
  { name: "Saanvi", rollNumber: "2026UME4127", department: "Content", branch: "Mechanical Engineering" },
  { name: "Saanvi Nagpal", rollNumber: "2026UBA9022", department: "Content", branch: "Management Studies" },
  { name: "Saanvi Sharma", rollNumber: "2026UBD9770", department: "Content", branch: "Bachelor of Design" },
  { name: "Saatvik Singhal", rollNumber: "2026UEE4617", department: "Content", branch: "Electrical Engineering" },
  { name: "Samaira Khanna", rollNumber: "2026UME4043", department: "Content", branch: "Mechanical Engineering" },
  { name: "Shabab Ahmed", rollNumber: "2026UIT3113", department: "Content", branch: "Information Technology" },
  { name: "Shaurya Chadha", rollNumber: "2026UEE4643", department: "Content", branch: "Electrical Engineering" },
  { name: "Shishant Yadav", rollNumber: "2026UCS1507", department: "Content", branch: "Computer Science" },
  { name: "Shreshth Dudeja", rollNumber: "2026UCA1557", department: "Content", branch: "CS (Artificial Intelligence)" },
  { name: "Sonakshi", rollNumber: "2026UEE3680", department: "Content", branch: "Electrical Engineering" },
  { name: "Subhanso Das", rollNumber: "2026UCM2350", department: "Content", branch: "Mathematics & Computing" },
  { name: "Swarnika Singh", rollNumber: "2026UEE4624", department: "Content", branch: "Electrical Engineering" },
  { name: "Tanvee Maan", rollNumber: "2026UEE4144", department: "Content", branch: "Electrical Engineering" },
  { name: "Tejas Yadav", rollNumber: "2026UEV2817", department: "Content", branch: "ECAM / VLSI" },
  { name: "Vaibhav Singh", rollNumber: "2026UIT3023", department: "Content", branch: "Information Technology" },
  { name: "Vedanta Bhardwaj", rollNumber: "2026UEE4590", department: "Content", branch: "Electrical Engineering" },
  { name: "Viraj Singh Sisodiya", rollNumber: "2026UCM2334", department: "Content", branch: "Mathematics & Computing" },
  { name: "Vishal Sati", rollNumber: "2026UBD9777", department: "Content", branch: "Bachelor of Design" },
  { name: "Yug Aggarwal", rollNumber: "2026UCA1890", department: "Content", branch: "CS (Artificial Intelligence)" },

  // ================= PHOTOGRAPHY (7 Candidates) =================
  { name: "Anirudh Badole", rollNumber: "2026UEE4600", department: "Photography", branch: "Electrical Engineering" },
  { name: "Avishka Varshney", rollNumber: "2026UEV2850", department: "Photography", branch: "ECAM / VLSI" },
  { name: "Kavyanshi", rollNumber: "2026UCE7067", department: "Photography", branch: "Civil Engineering" },
  { name: "Samar Galhot", rollNumber: "2026UBA9005", department: "Photography", branch: "Management Studies" },
  { name: "Shivin Arora", rollNumber: "2026UEC2530", department: "Photography", branch: "Electronics & Comm." },
  { name: "Shriyansh Sisodiya", rollNumber: "2026UCS1514", department: "Photography", branch: "Computer Science" },
  { name: "Syed Momin Razvi", rollNumber: "2026UBD9758", department: "Photography", branch: "Bachelor of Design" },
];

export default round2StaticCandidates;
