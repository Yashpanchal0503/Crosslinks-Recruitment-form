const data = [
  {
    _id: { $oid: "round2-photo-1" },
    personalDetails: { name: "Anirudh Badole", rollNumber: "2026UEE4600" },
    department: "Photography"
  },
  {
    _id: { $oid: "round2-photo-2" },
    personalDetails: { name: "Avishka Varshney", rollNumber: "2026UEV2850" },
    department: "Photography"
  },
  {
    _id: { $oid: "round2-photo-3" },
    personalDetails: { name: "Kavyanshi", rollNumber: "2026UCE7067" },
    department: "Photography"
  },
  {
    _id: { $oid: "round2-photo-4" },
    personalDetails: { name: "Samar Galhot", rollNumber: "2026UBA9005" },
    department: "Photography"
  },
  {
    _id: { $oid: "round2-photo-5" },
    personalDetails: { name: "Shivin Arora", rollNumber: "2026UEC2530" },
    department: "Photography"
  },
  {
    _id: { $oid: "round2-photo-6" },
    personalDetails: { name: "Shriyansh Sisodiya", rollNumber: "2026UCS1514" },
    department: "Photography"
  },
  {
    _id: { $oid: "round2-photo-7" },
    personalDetails: { name: "Syed Momin Razvi", rollNumber: "2026UBD9758" },
    department: "Photography"
  },
  {
    _id: { $oid: "round2-tech-1" },
    personalDetails: { name: "Deepanshu", rollNumber: "2026UEC2669" },
    department: "Tech"
  },
  {
    _id: { $oid: "round2-tech-2" },
    personalDetails: { name: "Manit Shukla", rollNumber: "2026UEC2604" },
    department: "Tech"
  },
  {
    _id: { $oid: "round2-tech-3" },
    personalDetails: { name: "Mayank", rollNumber: "2026UME4009" },
    department: "Tech"
  },
  {
    _id: { $oid: "round2-tech-4" },
    personalDetails: { name: "Ritesh Kumar", rollNumber: "2026UCS1599" },
    department: "Tech"
  },
  {
    _id: { $oid: "round2-tech-5" },
    personalDetails: { name: "Arpit Yadav", rollNumber: "2026UIC3566" },
    department: "Tech"
  },
  {
    _id: { $oid: "round2-tech-6" },
    personalDetails: { name: "Daivik Verma", rollNumber: "2026UIN2552" },
    department: "Tech"
  },
  {
    _id: { $oid: "round2-tech-7" },
    personalDetails: { name: "Pranay Balsana", rollNumber: "2026UCS1648" },
    department: "Tech"
  },
  {
    _id: { $oid: "round2-tech-8" },
    personalDetails: { name: "Pranav Kumar", rollNumber: "2026UMV7660" },
    department: "Tech"
  },
  {
    _id: { $oid: "round2-tech-9" },
    personalDetails: { name: "Niyati Jain", rollNumber: "2026UCS1550" },
    department: "Tech"
  },
  {
    _id: { $oid: "round2-gd-1" },
    personalDetails: { name: "Sachi Pandey", rollNumber: "2026UBD9771" },
    department: "Graphic Design"
  },
  {
    _id: { $oid: "round2-gd-2" },
    personalDetails: { name: "Akul Batra", rollNumber: "2026UEE3550" },
    department: "Graphic Design"
  },
  {
    _id: { $oid: "round2-gd-3" },
    personalDetails: { name: "Avani Patil", rollNumber: "2026UCS1517" },
    department: "Graphic Design"
  },
  {
    _id: { $oid: "round2-gd-4" },
    personalDetails: { name: "Vishal Sati", rollNumber: "2026UBD9777" },
    department: "Graphic Design"
  },
  {
    _id: { $oid: "round2-gd-5" },
    personalDetails: { name: "Tamanna Bansal", rollNumber: "2026UBA9026" },
    department: "Graphic Design"
  },
  {
    _id: { $oid: "round2-gd-6" },
    personalDetails: { name: "Anushka Raj Singhal", rollNumber: "2026UIT3034" },
    department: "Graphic Design"
  },
  {
    _id: { $oid: "round2-gd-7" },
    personalDetails: { name: "Oindrila Sil", rollNumber: "2026UEC2512" },
    department: "Graphic Design"
  },
  {
    _id: { $oid: "round2-gd-8" },
    personalDetails: { name: "Gauransh Atri", rollNumber: "2026UBD9761" },
    department: "Graphic Design"
  },
  {
    _id: { $oid: "round2-gd-9" },
    personalDetails: { name: "Sonam Kumari", rollNumber: "2026UBD9775" },
    department: "Graphic Design"
  },
  {
    _id: { $oid: "round2-gd-10" },
    personalDetails: { name: "Anukriti Kumar", rollNumber: "2026UIC3529" },
    department: "Graphic Design"
  },
  {
    _id: { $oid: "round2-gd-11" },
    personalDetails: { name: "Aritra Kundu", rollNumber: "2026UBD9760" },
    department: "Graphic Design"
  },
  {
    _id: { $oid: "round2-gd-12" },
    personalDetails: { name: "Manya Sharma", rollNumber: "2026UME4220" },
    department: "Graphic Design"
  },
  {
    _id: { $oid: "round2-gd-13" },
    personalDetails: { name: "Parth Chawla", rollNumber: "2026UIC4023" },
    department: "Graphic Design"
  },
  {
    _id: { $oid: "round2-video-1" },
    personalDetails: { name: "Aryaman Jain", rollNumber: "2026UEC2511" },
    department: "Video Editing"
  },
  {
    _id: { $oid: "round2-video-2" },
    personalDetails: { name: "Ayush Sahani", rollNumber: "2026UIT3072" },
    department: "Video Editing"
  },
  {
    _id: { $oid: "round2-video-3" },
    personalDetails: { name: "Khushi Garg", rollNumber: "2026UCA1929" },
    department: "Video Editing"
  },
  {
    _id: { $oid: "round2-video-4" },
    personalDetails: { name: "Vishal Sati", rollNumber: "2026UBD9777" },
    department: "Video Editing"
  },
  {
    _id: { $oid: "round2-video-5" },
    personalDetails: { name: "Avishi Naagar", rollNumber: "2026UBD9715" },
    department: "Video Editing"
  },
  {
    _id: { $oid: "round2-video-6" },
    personalDetails: { name: "Vyom Rana", rollNumber: "2026UGI7225" },
    department: "Video Editing"
  },
  {
    _id: { $oid: "round2-video-7" },
    personalDetails: { name: "Kaushal Kumar", rollNumber: "2026UGI7202" },
    department: "Video Editing"
  },
  {
    _id: { $oid: "round2-video-8" },
    personalDetails: { name: "Kavya Gulati", rollNumber: "2026UIT3009" },
    department: "Video Editing"
  },
  {
    _id: { $oid: "round2-video-9" },
    personalDetails: { name: "Rishav Sarkar", rollNumber: "2026UEE4644" },
    department: "Video Editing"
  },
  {
    _id: { $oid: "round2-video-10" },
    personalDetails: { name: "Tejas Yadav", rollNumber: "2026UEV2817" },
    department: "Video Editing"
  }
];

export default data;
