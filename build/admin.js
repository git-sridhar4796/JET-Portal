// ------------------
// GET DOM ELEMENTS
// ------------------

// Login Screen DOM elements
const adminLoginScreen = document.getElementById("adminLoginScreen");
const adminLoginForm = document.getElementById("adminLoginForm");
const adminEmailInput = document.getElementById("adminEmailInput");
const adminPwdInput = document.getElementById("adminPwdInput");
const adminLoginBtn = document.getElementById("adminLoginBtn");

// sidebar DOM elements
const adminSidebar = document.getElementById("adminSidebar");
const dashboard = document.getElementById("dashboard");
const proctoring = document.getElementById("proctoring");
const questionBank = document.getElementById("questionBank");
const studentStats = document.getElementById("studentStats");
const profile = document.getElementById("profile");

// screen DOM elements
const currentScreenText = document.getElementById("currentScreenText");
const dashboardScreen = document.getElementById("dashboardScreen");
const proctoringScreen = document.getElementById("proctoringScreen");
const questionBankScreen = document.getElementById("questionBankScreen");
const studentStatsScreen = document.getElementById("studentStatsScreen");
const profileScreen = document.getElementById("profileScreen");
const welcomeAdminBar = document.getElementById("welcomeAdminBar");
const adminName = document.getElementById("adminName");

// Dashboard DOM elements
// Row 1: Test Metrics
const testCompletedDateSelect = document.getElementById(
  "testCompletedDateSelect",
);
const dashTestCompletedCount = document.getElementById("testCompletedCount");
const dashEntranceBar = document.getElementById("entranceBar");
const dashScholarshipBar = document.getElementById("scholarshipBar");
const dashEntranceCountText = document.getElementById("entranceCountText");
const dashScholarshipCountText = document.getElementById(
  "scholarshipCountText",
);
const dashPassText = document.getElementById("passText");
const dashPassPercentBar = document.getElementById("passPercentBar");
const dashFailText = document.getElementById("failText");
const dashFailPercentBar = document.getElementById("failPercentBar");
const dashAverageScoreText = document.getElementById("averageScoreText");

// Row 2: Proctor & Live Stats
const proctorChartCanvas = document.getElementById("proctorChartCanvas");
const dashTotalText = document.getElementById("totalText");
const dashValidatedText = document.getElementById("validatedText");
const dashInvalidatedText = document.getElementById("invalidatedText");
const dashReviewPendingText = document.getElementById("reviewPendingText");
const dashActiveNowCount = document.getElementById("activeNowCount");

// Row 3: Leaderboard & Filters
const leaderboardTypeFilter = document.getElementById("leaderboardTypeFilter");
const leaderboardDateFilter = document.getElementById("leaderboardDateFilter");

const rank1Name = document.getElementById("rank1Name");
const rank1Score = document.getElementById("rank1Score");
const rank1Type = document.getElementById("rank1Type");

const rank2Name = document.getElementById("rank2Name");
const rank2Score = document.getElementById("rank2Score");
const rank2Type = document.getElementById("rank2Type");

const rank3Name = document.getElementById("rank3Name");
const rank3Score = document.getElementById("rank3Score");
const rank3Type = document.getElementById("rank3Type");

// question bank DOM elements
const uploadQuestionSetCard = document.getElementById("uploadQuestionSetCard");
const excelUpload = document.getElementById("excelUpload");
const downloadSampleCard = document.getElementById("downloadSampleCard");

// Profile screen DOM elements
const profileUsername = document.getElementById("profileUsername");
const profileEmailID = document.getElementById("profileEmailID");
const profilePwd = document.getElementById("profilePwd");

// Admin Login Credentials
const Admin_Users = [
  {
    username: "Sridhar S",
    email: "adithya.bharadwajan96@gmail.com",
    password: "shri@1234",
  },
  {
    username: "JIBA Admin",
    email: "jiba@dmifoundations.org",
    password: "jiba@2025",
  },
];
// Profile UI sync logic
const sycProfileUI = (user) => {
  if (profileUsername) profileUsername.textContent = user.username;
  if (profileEmailID) profileEmailID.textContent = user.email;
  if (profilePwd) {
    profilePwd.textContent = "********";
    profilePwd.setAttribute("data-password", user.password);
  }
};

// Login State
let isLoggedIn = false;
// Login screen logic
adminLoginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Clear any existing error messages first
  const existingError = adminLoginForm.querySelector(".error-msg");
  if (existingError) existingError.remove();
  // get input values
  const adminEmail = adminEmailInput.value.trim();
  const adminPwd = adminPwdInput.value.trim();

  const foundAdmin = Admin_Users.find(
    (user) => user.email === adminEmail && user.password === adminPwd,
  );

  if (foundAdmin) {
    isLoggedIn = true;
    // save session to local storage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("adminUser", JSON.stringify(foundAdmin));
    // sync profile UI
    sycProfileUI(foundAdmin);
    // update UI
    adminLoginScreen.classList.add("hidden");
    adminSidebar.classList.remove("hidden");
    dashboardScreen.classList.remove("hidden");
    welcomeAdminBar.classList.remove("hidden");
    currentScreenText.textContent = "Dashboard";
    adminName.textContent = foundAdmin.username;
  } else {
    const errorMsg = document.createElement("p");
    errorMsg.className =
      "error-msg text-red-500 text-sm mt-2 text-center w-full";
    errorMsg.textContent = "Invalid email or password. Please try again.";
    adminLoginForm.appendChild(errorMsg);
  }
});

// Check session on page load logic
document.addEventListener("DOMContentLoaded", () => {
  const loggedInStatus = localStorage.getItem("isLoggedIn");
  const savedUser = JSON.parse(localStorage.getItem("adminUser"));

  if (loggedInStatus === "true" && savedUser) {
    isLoggedIn = true;
    // sync profile UI
    sycProfileUI(savedUser);
    adminLoginScreen.classList.add("hidden");
    adminSidebar.classList.remove("hidden");
    dashboardScreen.classList.remove("hidden");
    welcomeAdminBar.classList.remove("hidden");
    currentScreenText.textContent = "Dashboard";
    adminName.textContent = savedUser.username;
  } else {
    adminLoginScreen.classList.remove("hidden");
    adminSidebar.classList.add("hidden");
    dashboardScreen.classList.add("hidden");
    studentStatsScreen.classList.add("hidden");
    welcomeAdminBar.classList.add("hidden");
  }
});

// Toggle password visibility logic
const togglePasswordVisibility = () => {
  const actualPassword = profilePwd.getAttribute("data-password");
  if (profilePwd.textContent === "********") {
    profilePwd.textContent = actualPassword;
  } else {
    profilePwd.textContent = "********";
  }
};

// edit user details logic
let isEditMode = false;

const editUserDetails = () => {
  const user = JSON.parse(localStorage.getItem("adminUser"));
  const nameDisplay = document.getElementById("profileUsername");
  const emailDisplay = document.getElementById("profileEmailID");
  const editBtn = document.querySelector("[onclick='editUserDetails()']");

  if (!isEditMode) {
    // ENTER EDIT MODE: Swap p tags for input fields
    nameDisplay.innerHTML = `<input type="text" id="editName" class="border border-purple-400 rounded px-1 outline-none" value="${user.username}">`;
    emailDisplay.innerHTML = `<input type="email" id="editEmail" class="border border-purple-400 rounded px-1 outline-none" value="${user.email}">`;

    // Change icon to a Save (Checkmark) icon
    editBtn.innerHTML = `<path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>`;

    isEditMode = true;
  } else {
    // EXIT EDIT MODE: Get values and save
    const newName = document.getElementById("editName").value.trim();
    const newEmail = document.getElementById("editEmail").value.trim();

    if (newName && newEmail) {
      // Update the local storage object
      user.username = newName;
      user.email = newEmail;
      localStorage.setItem("adminUser", JSON.stringify(user));

      // Re-sync the entire UI (Header name and Profile display)
      adminName.textContent = newName;
      sycProfileUI(user);

      // Change icon back to the Pencil icon
      editBtn.innerHTML = `<path d="M535.6 85.7C513.7 63.8 478.3 63.8 456.4 85.7L432 110.1L529.9 208L554.3 183.6C576.2 161.7 576.2 126.3 554.3 104.4L535.6 85.7zM236.4 305.7C230.3 311.8 225.6 319.3 222.9 327.6L193.3 416.4C190.4 425 192.7 434.5 199.1 441C205.5 447.5 215 449.7 223.7 446.8L312.5 417.2C320.7 414.5 328.2 409.8 334.4 403.7L496 241.9L398.1 144L236.4 305.7zM160 128C107 128 64 171 64 224L64 480C64 533 107 576 160 576L416 576C469 576 512 533 512 480L512 384C512 366.3 497.7 352 480 352C462.3 352 448 366.3 448 384L448 480C448 497.7 433.7 512 416 512L160 512C142.3 512 128 497.7 128 480L128 224C128 206.3 142.3 192 160 192L256 192C273.7 192 288 177.7 288 160C288 142.3 273.7 128 256 128L160 128z"/>`;

      isEditMode = false;
    }
  }
};

// Edit password logic
let isPwdEditing = false;

const editPassword = () => {
  const pwdDisplay = document.getElementById("profilePwd");
  const changeBtn = document.getElementById("changePwdBtn");
  const user = JSON.parse(localStorage.getItem("adminUser"));

  if (!isPwdEditing) {
    // Switch to input field
    const currentPwd = pwdDisplay.getAttribute("data-password");
    pwdDisplay.innerHTML = `<input type="text" id="newPwdInput" class="border border-purple-400 rounded px-1 outline-none text-sm w-32" value="${currentPwd}">`;
    changeBtn.textContent = "Save";
    isPwdEditing = true;
  } else {
    // Save the new password
    const newPwd = document.getElementById("newPwdInput").value.trim();

    if (newPwd.length >= 8) {
      // Basic validation
      user.password = newPwd;

      // Update Local Storage
      localStorage.setItem("adminUser", JSON.stringify(user));

      // Update UI and switch back to masked p tag
      pwdDisplay.setAttribute("data-password", newPwd);
      pwdDisplay.textContent = "********";
      changeBtn.textContent = "Change";

      showModal("success", "Password updated successfully!");
      isPwdEditing = false;
    } else {
      alert("Password must be at least 8 characters.");
    }
  }
};

// Logout function
const handleLogout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("adminUser");
  isLoggedIn = false;
  window.location.reload();
};

// sidebar navigation
// toggle hidden function
const toggleHidden = (selectedScreen, selectedButton) => {
  const screens = [
    dashboardScreen,
    proctoringScreen,
    questionBankScreen,
    studentStatsScreen,
    profileScreen,
  ];
  screens.forEach((screen) => {
    screen.classList.add("hidden");
  });
  selectedScreen.classList.remove("hidden");

  const sidebarButtons = [
    dashboard,
    proctoring,
    questionBank,
    studentStats,
    profile,
  ];
  sidebarButtons.forEach((button) => {
    button.classList.remove("bg-purple-600");
  });
  selectedButton.classList.add("bg-purple-600");
  currentScreenText.textContent =
    selectedScreen == dashboardScreen
      ? "Dashboard"
      : selectedScreen == proctoringScreen
        ? "Proctoring"
        : selectedScreen == questionBankScreen
          ? "Question Bank"
          : selectedScreen == studentStatsScreen
            ? "Student Stats"
            : "Profile";
  if (selectedScreen === studentStatsScreen) {
    renderStudentStatsTable();
  }
};
// navigation
dashboard.addEventListener("click", () =>
  toggleHidden(dashboardScreen, dashboard),
);
proctoring.addEventListener("click", () =>
  toggleHidden(proctoringScreen, proctoring),
);
questionBank.addEventListener("click", () =>
  toggleHidden(questionBankScreen, questionBank),
);
studentStats.addEventListener("click", () =>
  toggleHidden(studentStatsScreen, studentStats),
);
profile.addEventListener("click", () => toggleHidden(profileScreen, profile));

// -----------------------------
// DASHBOARD SCREEN LOGIC
// -----------------------------

// Test completed date filter logic
testCompletedDateSelect.addEventListener("change", (e) => {
  const selectedValue = e.target.value;
  const now = new Date();

  // Normalize "Today" to Midnight (Zero-Hour)
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  const filteredCount = rawProctoringData.filter((s) => {
    if (s.Status !== "Completed" || !s.Timestamp) return false;

    // Parse ISO Timestamp and normalize to Midnight
    const entryDate = new Date(s.Timestamp);
    const entryDay = new Date(
      entryDate.getFullYear(),
      entryDate.getMonth(),
      entryDate.getDate(),
    ).getTime();

    switch (selectedValue) {
      case "today":
        return entryDay === todayStart;

      case "yesterday":
        return entryDay === todayStart - oneDay;

      case "lastMonth":
        return entryDay >= todayStart - 30 * oneDay;

      case "allTime":
      default:
        return true;
    }
  }).length;

  dashTestCompletedCount.textContent = filteredCount;
});

// Update dashboard test metrics function
const updateTestMetrics = (data) => {
  const completedTests = data.filter((s) => s.Status === "Completed");
  // Test completed count
  dashTestCompletedCount.textContent = completedTests.length;
  // test type distribution count
  const entranceCount = completedTests.filter(
    (s) => s["Exam Type"] === "Entrance Test",
  ).length;
  const scholarshipCount = completedTests.filter(
    (s) => s["Exam Type"] === "Scholarship Test",
  ).length;
  dashEntranceCountText.textContent = entranceCount;
  dashScholarshipCountText.textContent = scholarshipCount;
  dashEntranceBar.style.width =
    entranceCount > 0
      ? `${(entranceCount / completedTests.length) * 100}%`
      : "0%";
  dashScholarshipBar.style.width =
    scholarshipCount > 0
      ? `${(scholarshipCount / completedTests.length) * 100}%`
      : "0%";

  // pass/fail distribution count
  const passCount = completedTests.filter((s) => s.Percentage >= 40).length;
  const failCount = completedTests.filter((s) => s.Percentage < 40).length;
  dashPassPercentBar.style.width =
    passCount > 0
      ? `${Math.round((passCount / completedTests.length) * 100)}%`
      : "0%";
  dashFailPercentBar.style.width =
    failCount > 0
      ? `${Math.round(failCount / completedTests.length) * 100}%`
      : "0%";
  dashPassText.textContent = `${Math.round((passCount / completedTests.length) * 100)}%`;
  dashFailText.textContent = `${Math.round((failCount / completedTests.length) * 100)}%`;
  // average score
  const totalScore = completedTests.reduce((sum, s) => {
    const score = Number(s.Score) || 0;
    return sum + score;
  }, 0);
  const averageScore =
    completedTests.length > 0
      ? (totalScore / completedTests.length).toFixed(2)
      : 0;
  dashAverageScoreText.innerHTML = `${averageScore} <span class="text-gray-500 text-lg 2xl:text-3xl">/ 30</span>`;
};

// Proctoring Status Pie Chart
let myChart; // Global variable to store the chart instance

function updateDashboardChart(validated, invalidated, pending) {
  const ctx = document.getElementById("proctorChartCanvas").getContext("2d");

  const total = validated + invalidated + pending;
  // If no data exists, don't draw chart
  if (total === 0) {
    if (myChart) myChart.destroy();
    return;
  }

  // If chart exists, destroy it before re-creating to prevent memory leaks
  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Validated", "In-Validated", "Pending"],
      datasets: [
        {
          data: [validated, invalidated, pending],
          backgroundColor: ["#22c55e", "#ef4444", "#e5e7eb"],
          borderWidth: 2,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
        datalabels: {
          anchor: "end",
          align: "end",
          formatter: (value, context) => {
            // Get the total sum of all data points
            const datapoints = context.dataset.data;
            const total = datapoints.reduce((total, num) => total + num, 0);

            // Calculate percentage
            const percentage =
              total > 0 ? Math.round((value / total) * 100) : 0;
            return percentage + "%";
          },
          color: "#4b5563",
          font: {
            weight: "bold",
            size: 12,
          },
          offset: 2,
        },
      },
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 40,
        },
      },
    },
    plugins: [ChartDataLabels],
  });
}

// Update dashboard proctoring stats function
const updateProctoringMetrics = (data) => {
  const completedTests = data.filter((s) => s.Status === "Completed");
  const validatedCount = completedTests.filter(
    (s) => s["Proctor Status"] === "Validated",
  ).length;
  const invalidatedCount = completedTests.filter(
    (s) => s["Proctor Status"] === "In-Validated",
  ).length;
  const reviewPendingCount =
    completedTests.length - (validatedCount + invalidatedCount);
  updateDashboardChart(validatedCount, invalidatedCount, reviewPendingCount);
  dashTotalText.textContent = completedTests.length;
  dashValidatedText.textContent = validatedCount;
  dashInvalidatedText.textContent = invalidatedCount;
  dashReviewPendingText.textContent = reviewPendingCount;
  const activeNowCount = data.filter((s) => s.Status === "Active").length;
  dashActiveNowCount.textContent = activeNowCount;
};

// Update leaderboard function
const updateLeaderboardMetrics = (data) => {
  if (!data || data.length === 0) return;

  // Get filters from the UI
  const typeFilter = leaderboardTypeFilter.value; // 'all', 'entrance', 'scholarship'
  const dateFilter = leaderboardDateFilter.value; // 'today', 'yesterday', 'all', etc.

  // Filter the data based on Status and UI Dropdowns
  let filteredData = data.filter((s) => s.Status === "Completed");

  // Filter by Test Type
  if (typeFilter !== "all") {
    const filterText =
      typeFilter === "entrance" ? "Entrance Test" : "Scholarship Test";
    filteredData = filteredData.filter((s) => s["Exam Type"] === filterText);
  }

  // Filter by Date
  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  if (dateFilter !== "all") {
    filteredData = filteredData.filter((s) => {
      if (!s.Timestamp) return false;

      // Safely parse the standardized ISO timestamp
      const entryDate = new Date(s.Timestamp);
      const entryDay = new Date(
        entryDate.getFullYear(),
        entryDate.getMonth(),
        entryDate.getDate(),
      ).getTime();

      if (dateFilter === "today") return entryDay === todayStart;

      if (dateFilter === "yesterday") {
        return entryDay === todayStart - oneDay;
      }

      if (dateFilter === "week") {
        // Today is April 21. This will correctly calculate 7 days back to April 14.
        // April 5th is now mathematically excluded.
        return entryDay >= todayStart - 7 * oneDay;
      }

      if (dateFilter === "month") {
        return entryDay >= todayStart - 30 * oneDay;
      }
      return true;
    });
  }

  // Sort Logic: Primary = Score (High to Low), Secondary = Time Taken (Fast to Slow)
  filteredData.sort((a, b) => {
    const scoreA = Number(a.Score) || 0;
    const scoreB = Number(b.Score) || 0;

    if (scoreB !== scoreA) {
      return scoreB - scoreA; // Higher score takes precedence
    } else {
      // Tie-breaker: Time Taken (Lower is better/faster)
      const timeA = a["Time Taken"] || "99:99";
      const timeB = b["Time Taken"] || "99:99";
      return timeA.localeCompare(timeB);
    }
  });

  const toppers = filteredData.slice(0, 3);

  // Update the UI Podiums (Rank 1, 2, and 3)
  const updatePodiumUI = (rank, student) => {
    const nameEl = document.getElementById(`rank${rank}Name`);
    const scoreEl = document.getElementById(`rank${rank}Score`);
    const typeEl = document.getElementById(`rank${rank}Type`);

    if (student) {
      nameEl.textContent = student["Student Name"];
      scoreEl.textContent = student.Score;
      const examType = student["Exam Type"] || "General";
      typeEl.textContent = examType;
    } else {
      nameEl.textContent = "---";
      scoreEl.textContent = "00";
      typeEl.textContent = "---";
    }
  };

  // Inject into the 3 podium cards
  updatePodiumUI(1, toppers[0]);
  updatePodiumUI(2, toppers[1]);
  updatePodiumUI(3, toppers[2]);
};

// Add event listeners to the Leaderboard filters
leaderboardTypeFilter.addEventListener("change", () =>
  updateLeaderboardMetrics(rawProctoringData),
);
leaderboardDateFilter.addEventListener("change", () =>
  updateLeaderboardMetrics(rawProctoringData),
);

// Update dashboard stats function
const updateDashboardStats = (data) => {
  if (!data || data.length === 0) return;
  updateTestMetrics(data);
  updateProctoringMetrics(data);
  updateLeaderboardMetrics(data);
};

// -----------------------------
// QUESTION BANK UPLOAD LOGIC
// -----------------------------

// Capture the table elements
const questionSetsTableBody = document.getElementById("questionSets");
const tablePlaceholder = document.getElementById("questionSetTablePlaceholder");

// 1. Trigger the hidden file input when the card is clicked
uploadQuestionSetCard.addEventListener("click", () => {
  excelUpload.click();
});

// 2. Handle the file selection and read the Excel data
excelUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    // Check if SheetJS loaded correctly
    if (typeof XLSX === "undefined") {
      showModal(
        "error",
        "SheetJS library is not loaded. Please check your HTML <head>.",
      );
      return;
    }

    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // Grab the first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert to a 2D array
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    processExcelData(rows);

    // Clear the input so the same file can be uploaded again if needed
    excelUpload.value = "";
  };

  reader.readAsArrayBuffer(file);
});

// 3. Process the Data (Targeting your specific Double-Header layout)
function processExcelData(rows) {
  try {
    // Extract Metadata from Row 2 (Index 1)
    const testName = rows[1][0]; // "JET 2026"
    const examType = rows[1][1]; // exam type
    const questionSet = rows[1][2]; // "1"
    const totalMarks = rows[1][3]; // 50
    const duration = rows[1][4]; // 60
    const totalQns = rows[1][5]; // 50

    // Extract Questions starting from Row 5 (Index 4)
    // Filters out empty rows to prevent undefined data
    const questionsData = rows
      .slice(4)
      .filter((row) => row.length > 0 && row[0] !== undefined);

    const examData = {
      testName: testName,
      examType: examType,
      setID: questionSet,
      totalMarks: totalMarks,
      duration: duration,
      expectedTotal: totalQns,
      questions: questionsData.map((row, index) => ({
        id: index + 1,
        text: row[0], // "Questions" column
        options: [row[1], row[2], row[3], row[4]], // "Options 1-4" columns
        correctAnswer: row[5], // "Correct Answer" column
      })),
    };

    console.log("Successfully Parsed Exam Set:", examData);
    saveToGoogleSheets(examData);
  } catch (error) {
    console.error("Data Extraction Error:", error);
    showModal(
      "error",
      "Error reading file. Please make sure you are using the exact JET Sample Format.",
    );
  }
}

// 4. Update the UI Table
function updateQuestionBankTable(data) {
  // Hide the "No question sets uploaded yet" placeholder
  if (tablePlaceholder && tablePlaceholder.style.display !== "none") {
    tablePlaceholder.style.display = "none";
  }

  // Determine the S.No.
  const currentRowCount = questionSetsTableBody.querySelectorAll(
    "tr:not(#questionSetTablePlaceholder)",
  ).length;
  const serialNumber = currentRowCount + 1;

  // Get today's date in DD/MM/YYYY format
  const today = new Date().toLocaleDateString("en-GB");

  // Create the new table row
  const tr = document.createElement("tr");
  tr.className = "border-b text-sm text-center bg-white hover:bg-gray-50";

  const displayExamType = data.examType || "N/A";
  const displayCount =
    data.questionCount || (data.questions ? data.questions.length : 0);
  tr.innerHTML = `
    <td class="py-2 border-r-2 border-gray-100">${serialNumber}</td>
    <td class="py-2 border-r-2 border-gray-100 font-medium">${data.testName} - ${displayExamType} - Set ${data.setID}</td>
    <td class="py-2 border-r-2 border-gray-100">${displayCount}</td>
    <td class="py-2 border-r-2 border-gray-100">${today}</td>
    <td class="py-2 border-r-2 border-gray-100">Sridhar</td>
    <td class="py-2">
        <button class="delete-btn text-red-500 hover:text-red-700 font-semibold px-2 py-1 rounded transition-colors duration-150">Delete</button>
    </td>
  `;

  // Attach Delete Logic for this specific row
  const deleteBtn = tr.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", function () {
    showModal(
      "confirm",
      `Are you sure you want to permanently remove ${data.testName} - Set ${data.setID}?`,
      () => {
        // Run the backend delete function (which will handle the UI removal if successful)
        deleteFromGoogleSheets(data.testName, data.setID, tr);
      },
    );
  });

  // Inject the row into the table
  questionSetsTableBody.appendChild(tr);
}

// 5. Utility: Keep S.No. accurate after a deletion
function recalculateSerialNumbers() {
  const rows = questionSetsTableBody.querySelectorAll(
    "tr:not(#questionSetTablePlaceholder)",
  );

  // If all sets are deleted, bring the placeholder back
  if (rows.length === 0) {
    tablePlaceholder.style.display = "table-row";
    return;
  }

  // Re-number remaining rows
  rows.forEach((row, index) => {
    row.cells[0].innerText = index + 1;
  });
}

// -----------------------------
// UI MODAL CONTROLLER
// -----------------------------
function showModal(state, message, onCallback = null) {
  // Remove existing modal if any
  const existingModal = document.getElementById("dynamicModal");
  if (existingModal) existingModal.remove();

  let iconHTML = "";
  let buttonsHTML = "";

  // Determine Icon and Buttons based on state
  if (state === "loading") {
    iconHTML = `
      <svg class="animate-spin h-12 w-12 text-purple-700 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>`;
  } else if (state === "success") {
    iconHTML = `
      <svg class="h-12 w-12 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>`;
    buttonsHTML = `<button id="modalOkBtn" class="bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white font-semibold py-2 px-8 rounded shadow transition-colors duration-200">OK</button>`;
  } else if (state === "error") {
    iconHTML = `
      <svg class="h-12 w-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>`;
    buttonsHTML = `<button id="modalOkBtn" class="bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white font-semibold py-2 px-8 rounded shadow transition-colors duration-200">OK</button>`;
  } else if (state === "confirm") {
    // New Warning Icon for Delete Confirmations
    iconHTML = `
      <svg class="h-12 w-12 text-yellow-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>`;
    // Cancel and Delete Buttons
    buttonsHTML = `
      <div class="flex gap-4 w-full justify-center mt-2">
        <button id="modalCancelBtn" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded shadow transition-colors duration-200">Cancel</button>
        <button id="modalConfirmBtn" class="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-2 px-6 rounded shadow transition-colors duration-200">Delete</button>
      </div>`;
  }

  // Create the Modal HTML
  const modalHTML = `
    <div id="dynamicModal" class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm transition-opacity">
      <div class="bg-white rounded-lg shadow-2xl p-8 w-96 flex flex-col items-center text-center transform scale-100 transition-transform">
        ${iconHTML}
        <p class="text-gray-800 text-lg font-medium mb-4">${message}</p>
        ${buttonsHTML}
      </div>
    </div>
  `;

  // Inject into body
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Attach Event Listeners
  if (state === "success" || state === "error") {
    document.getElementById("modalOkBtn").addEventListener("click", () => {
      document.getElementById("dynamicModal").remove();
      if (onCallback) onCallback();
    });
  } else if (state === "confirm") {
    document.getElementById("modalCancelBtn").addEventListener("click", () => {
      document.getElementById("dynamicModal").remove(); // Just close, do nothing
    });
    document.getElementById("modalConfirmBtn").addEventListener("click", () => {
      document.getElementById("dynamicModal").remove();
      if (onCallback) onCallback(); // Run the delete logic!
    });
  }
}

// -----------------------------
// GOOGLE SHEETS DATABASE CONNECTION
// -----------------------------

async function saveToGoogleSheets(examData) {
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxZJ5GQRN_rvcL1b5gpbple_9QUdEJKKNBJ5PtYlp55fCnLsCCgQAAIJFhZGBngkez7nA/exec";

  try {
    // 1. Show the Loading Modal
    showModal("loading", "Uploading to database. Please wait...");
    console.log("Connecting to JIBA Database...");

    // 2. Send the data
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(examData),
    });

    if (response.ok) {
      console.log("Database update successful!");

      // 3. Show the Success Modal, and pass the table update function inside the callback
      showModal(
        "success",
        `Success! ${examData.testName} - ${examData.examType}- Set ${examData.setID} has been permanently saved.`,
        () => {
          updateQuestionBankTable(examData); // This runs ONLY when "OK" is clicked
        },
      );
    } else {
      console.warn("Data sent, but received a non-OK status.");
      showModal(
        "error",
        "Data sent, but there was an issue verifying the save. Please check the database.",
      );
    }
  } catch (error) {
    console.error("Network Error:", error);
    showModal(
      "error",
      "Could not connect to the database. Please check your internet connection.",
    );
  }
}

// -----------------------------
// DELETE FROM DATABASE LOGIC
// -----------------------------
async function deleteFromGoogleSheets(testName, examType, setID, trElement) {
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxZJ5GQRN_rvcL1b5gpbple_9QUdEJKKNBJ5PtYlp55fCnLsCCgQAAIJFhZGBngkez7nA/exec";

  try {
    // 1. Show the Loading Modal
    showModal(
      "loading",
      `Deleting ${testName} - Set ${setID} from database...`,
    );

    // 2. Send the delete command
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "delete", // This tells the Apps Script which logic block to run
        testName: testName,
        examType: examType,
        setID: String(setID),
      }),
    });

    if (response.ok) {
      // 3. Show Success Modal and remove the row from the table
      showModal(
        "success",
        `Success! ${testName} - Set ${setID} has been completely removed.`,
        () => {
          trElement.remove();
          recalculateSerialNumbers();
        },
      );
    } else {
      showModal(
        "error",
        "Failed to delete from the database. Please try again.",
      );
    }
  } catch (error) {
    console.error("Network Error:", error);
    showModal(
      "error",
      "Could not connect to the database. Check your internet connection.",
    );
  }
}

// -----------------------------
// AUTO-LOAD EXISTING DATA ON REFRESH
// -----------------------------

async function loadExistingSets() {
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxZJ5GQRN_rvcL1b5gpbple_9QUdEJKKNBJ5PtYlp55fCnLsCCgQAAIJFhZGBngkez7nA/exec";

  try {
    // Change placeholder text to show it's loading
    if (tablePlaceholder) {
      tablePlaceholder.innerHTML = `<td colspan="6" class="py-8 text-gray-500 font-medium animate-pulse text-center">Fetching database...</td>`;
    }

    const response = await fetch(SCRIPT_URL);
    const existingSets = await response.json();

    if (existingSets.length > 0) {
      // Hide the placeholder
      if (tablePlaceholder) tablePlaceholder.style.display = "none";

      // Get today's date for the display
      const today = new Date().toLocaleDateString("en-GB");

      // Loop through the data from Google Sheets and build the rows
      existingSets.forEach((data, index) => {
        const tr = document.createElement("tr");
        tr.className = "border-b text-sm text-center bg-white hover:bg-gray-50";

        tr.innerHTML = `
          <td class="py-2 border-r-2 border-gray-100">${index + 1}</td>
          <td class="py-2 border-r-2 border-gray-100 font-medium">${data.testName} - ${data.examType} - Set ${data.setID}</td>
          <td class="py-2 border-r-2 border-gray-100">${data.questionCount}</td>
          <td class="py-2 border-r-2 border-gray-100">${today}</td>
          <td class="py-2 border-r-2 border-gray-100">Sridhar</td>
          <td class="py-2">
              <button class="delete-btn text-red-500 hover:text-red-700 font-semibold px-2 py-1 rounded transition-colors duration-150">Delete</button>
          </td>
        `;

        // Attach Delete Logic for this specific row
        const deleteBtn = tr.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", function () {
          showModal(
            "confirm",
            `Are you sure you want to permanently remove ${data.testName} - ${data.examType} - Set ${data.setID}?`,
            () => {
              // Run the backend delete function (which will handle the UI removal if successful)
              deleteFromGoogleSheets(
                data.testName,
                data.examType,
                data.setID,
                tr,
              );
            },
          );
        });

        questionSetsTableBody.appendChild(tr);
      });
    } else {
      // If the database is empty, restore the original placeholder text
      if (tablePlaceholder) {
        tablePlaceholder.innerHTML = `<td colspan="6" class="py-8 text-gray-400 font-medium">No question sets uploaded yet</td>`;
      }
    }
  } catch (error) {
    console.error("Error loading existing sets:", error);
    if (tablePlaceholder) {
      tablePlaceholder.innerHTML = `<td colspan="6" class="py-8 text-red-400 font-medium">Failed to load database. Check connection.</td>`;
    }
  }
}

// Trigger this function immediately when the page loads!
document.addEventListener("DOMContentLoaded", loadExistingSets);

// download sample format
downloadSampleCard.addEventListener("click", () => {
  const filepath = "../src/JET_Sample_Format.xlsx";
  const link = document.createElement("a");
  link.href = filepath;
  link.download = "JET_Sample_Format.xlsx";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// -----------------------------
// PROCTORING TAB SCREEN
// -----------------------------

// DOM Elements
const globalDateFilter = document.getElementById("globalDateFilter");
const metricActive = document.getElementById("metricActive");
const metricCompleted = document.getElementById("metricCompleted");
const metricViolations = document.getElementById("metricViolations");
const metricTerminated = document.getElementById("metricTerminated");
const activiyLogFeed = document.getElementById("activiyLogFeed");
const proctorSearchBar = document.getElementById("proctorSearchBar");
const proctorStatusFilter = document.getElementById("proctorStatusFilter");
const proctorTableBody = document.getElementById("proctorTableBody");

let rawProctoringData = [];
let previousDataString = "";
const resultsScriptUrl =
  "https://script.google.com/macros/s/AKfycbx4lXCelHi0mIc72wpRFoC4GwHg9fDvjsz4F71ejsU-tJVEUz29RXdnjkntOec53gY/exec";

// Fetch data from Google sheets
async function fetchProctoringData() {
  try {
    const response = await fetch(resultsScriptUrl);
    const newData = await response.json();
    const currentDataString = JSON.stringify(newData);
    // ONLY update if the data has changed
    if (currentDataString !== previousDataString) {
      rawProctoringData = newData;
      previousDataString = currentDataString;
      applyGlobalDateFilter();
      updateDashboardStats(rawProctoringData);
      renderStudentStatsTable();
      console.log("Data changed. Dashboard updated.");
    } else {
      console.log("No changes in data. Skipping UI redraw.");
    }
  } catch (error) {
    console.error("Error fetching proctoring data:", error);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  fetchProctoringData();
});
setInterval(fetchProctoringData, 5000);

// Global Date Filter Function
const applyGlobalDateFilter = () => {
  const filterValue = globalDateFilter.value;
  const now = new Date();

  // Normalize today to Midnight
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  const filteredData = rawProctoringData.filter((entry) => {
    if (!entry.Timestamp) return false;

    // ISO strings
    const entryDate = new Date(entry.Timestamp);
    const entryDay = new Date(
      entryDate.getFullYear(),
      entryDate.getMonth(),
      entryDate.getDate(),
    ).getTime();

    if (filterValue === "allTime") return true;

    if (filterValue === "today") {
      return entryDay === todayStart;
    }

    if (filterValue === "yesterday") {
      return entryDay === todayStart - oneDay;
    }

    if (filterValue === "last7") {
      // Consistent 7-day logic
      return entryDay >= todayStart - 7 * oneDay;
    }

    return true;
  });

  // Pass the date-filtered data to the rest of the UI
  updateLiveMetrics(filteredData);
  updateActivityLog(filteredData);
  renderProctoringTable(filteredData);
};

globalDateFilter.addEventListener("change", applyGlobalDateFilter);
document.addEventListener("DOMContentLoaded", applyGlobalDateFilter);

// Update Live Metrics Function
const updateLiveMetrics = (data) => {
  let activeCount = 0;
  let completedCount = 0;
  let terminatedCount = 0;
  let totalViolationsCount = 0;
  // loop through filtered data and update counts
  data.forEach((student) => {
    if (student.Status === "Active") activeCount++;
    if (student.Status === "Completed") completedCount++;
    if (student.Status === "Terminated") terminatedCount++;
    const violations = parseInt(student["Violation Count"]) || 0;
    totalViolationsCount += violations;
  });
  // update the UI with the metrics
  metricActive.textContent = activeCount;
  metricTerminated.textContent = terminatedCount;
  metricCompleted.textContent = completedCount;
  metricViolations.textContent = totalViolationsCount;
};

// Update Activity Log Function
const updateActivityLog = (data) => {
  // Clear the feed before re-rendering
  activiyLogFeed.innerHTML = "";

  const activeLogs = data.filter((student) => student["Latest Activity"]);
  if (activeLogs.length === 0) {
    const noActivityMsg = document.createElement("p");
    noActivityMsg.className = "text-gray-500 italic text-center py-4";
    noActivityMsg.textContent = "No activity to log for the selected period.";
    activiyLogFeed.appendChild(noActivityMsg);
    return;
  }

  // Sort data by Timestamp: Oldest to Newest
  const sortedData = [...activeLogs].sort(
    (a, b) => new Date(b.Timestamp) - new Date(a.Timestamp),
  );

  // Loop and create entries
  sortedData.forEach((student) => {
    const logItem = document.createElement("p");
    const isTerminated = student.Status === "Terminated";

    // Apply dynamic classes: Red for Terminated, Purple for others
    logItem.className = `w-full border-l-4 pl-2 py-1 mb-1 transition-colors ${
      isTerminated
        ? "border-red-600 hover:bg-red-50 font-semibold"
        : "border-purple-400 hover:bg-purple-50"
    }`;

    const dateObj = new Date(student.Timestamp);
    const dateString = dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

    const timeString = dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    logItem.innerHTML = `
      <span class="text-gray-400 font-mono text-xs">[${dateString} ${timeString}]</span>
      <span class="${isTerminated ? "text-red-700" : "text-purple-800"} font-bold">
        ${student["Student ID"]}
      </span> 
      <span class="${isTerminated ? "text-red-600" : "text-gray-600"}">
        ${student["Latest Activity"]}
      </span>`;

    activiyLogFeed.appendChild(logItem);
  });

  // Auto-scroll to the bottom so the newest log is always visible
  activiyLogFeed.scrollTop = activiyLogFeed.scrollHeight;
};

// Proctoring Needs Review Table Function
const renderProctoringTable = (data) => {
  const searchTerm = proctorSearchBar.value.toLowerCase().trim();
  const statusFilter = proctorStatusFilter.value;

  // Apply Local Filters (Search & Status)
  const localFilteredData = data.filter((student) => {
    const matchesSearch =
      student["Student ID"]?.toLowerCase().includes(searchTerm) ||
      student["Student Name"]?.toLowerCase().includes(searchTerm);

    const matchesStatus =
      statusFilter === "showAll" ||
      (statusFilter === "reviewPending" &&
        student["Proctor Status"] === "Review Pending") ||
      (statusFilter === "validated" &&
        student["Proctor Status"] === "Validated") ||
      (statusFilter === "invalidated" &&
        student["Proctor Status"] === "In-Validated");

    return matchesSearch && matchesStatus;
  });

  localFilteredData.sort(
    (a, b) => new Date(b.Timestamp) - new Date(a.Timestamp),
  );

  proctorTableBody.innerHTML = "";

  // Handle Empty State
  if (localFilteredData.length === 0) {
    proctorTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-10 text-gray-400 italic">
          No exams match the current search or filters.
        </td>
      </tr>`;
    return;
  }

  // Generate Rows
  localFilteredData.forEach((student) => {
    const tr = document.createElement("tr");
    tr.className = "border-b hover:bg-purple-50 transition-colors text-center";

    // ISO string to a local readable format
    const dateObj = new Date(student.Timestamp);
    const formattedTime =
      dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }) +
      " " +
      dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

    // Color logic for Status Dot
    const dotClass =
      student["Status"] === "Active"
        ? "bg-blue-500 animate-pulse"
        : student["Status"] === "Terminated"
          ? "bg-red-500"
          : student["Status"] === "Completed"
            ? "bg-green-500"
            : "bg-gray-400";

    // Text color for status
    const statusColor =
      student["Status"] === "Terminated"
        ? "text-red-600 font-bold"
        : student["Status"] === "Active"
          ? "text-blue-600 font-semibold"
          : "text-green-600";

    // Proctor Status with color
    const proctorStatus = student["Proctor Status"] || "Review Pending";
    const proctorStatusClass =
      proctorStatus === "Validated"
        ? "text-green-600 font-bold"
        : proctorStatus === "In-Validated"
          ? "text-red-600 font-bold"
          : "text-yellow-600 italic";

    // Highlight violations class
    const violationCount = parseInt(student["Violation Count"]) || 0;
    const violationClass =
      violationCount > 0
        ? "bg-red-100 text-red-700 font-bold px-2 py-1 rounded"
        : "";

    // Build the row
    tr.innerHTML = `
      <td class="py-3 border-r border-gray-100">
        <span class="inline-block h-4 w-4 rounded-full ${dotClass}"></span>
      </td>
      <td class="py-3 border-r border-gray-100 font-mono text-xs text-gray-500">${formattedTime}</td>
      <td class="py-3 border-r border-gray-100">${student["Student ID"]}</td>
      <td class="py-3 border-r border-gray-100 text-left pl-2">${student["Student Name"]}</td>
      <td class="py-3 border-r border-gray-100 ${statusColor}">${student["Status"]}</td>
      <td class="py-3 border-r border-gray-100">
        <span class="${violationClass}">${violationCount}</span>
      </td>
      <td class="py-3 border-r border-gray-100 ${proctorStatusClass}">${proctorStatus}</td>
      <td class="py-3">
        <button class="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 rounded shadow-sm active:scale-95 transition"
                onclick="openProctorReview('${student["Student ID"]}')">
          Review
        </button>
      </td>
    `;
    proctorTableBody.appendChild(tr);
  });
};

// Listeners for Local Table Filters
proctorSearchBar.addEventListener("input", () => applyGlobalDateFilter());
proctorStatusFilter.addEventListener("change", () => applyGlobalDateFilter());

// Proctor Snaps Review Modal
const galleryModalOverlay = document.getElementById("galleryModalOverlay");
const snapsModalStudentName = document.getElementById("snapsModalStudentName");
const snapsModalAppID = document.getElementById("snapsModalAppID");
const galleryContainer = document.getElementById("galleryContainer");
const validateBtn = document.getElementById("validateBtn");
const inValidateBtn = document.getElementById("inValidateBtn");
const proctoringSnapsUrl =
  "https://script.google.com/macros/s/AKfycbyy_Hyk8p9vm8tbaySBJ1J-W0Iba29CjVMhcnvolrFGZewlO9J8ajgf8gk36VXsop63/exec";
// function to open gallery modal
const openProctorReview = async (studentId) => {
  galleryModalOverlay.classList.remove("hidden");
  galleryContainer.innerHTML = `<p class="col-span-4 text-center py-10 text-gray-500 animate-pulse">Fetching snapshots from Drive...</p>`;
  const studentData = rawProctoringData.find(
    (s) => s["Student ID"] === studentId,
  );
  // update student data
  if (studentData) {
    snapsModalStudentName.textContent = studentData["Student Name"];
    snapsModalAppID.textContent = studentData["Student ID"];
  }
  // update the snaps
  try {
    const response = await fetch(
      `${proctoringSnapsUrl}?action=getImages&appId=${studentId}`,
    );
    const images = await response.json();
    galleryContainer.innerHTML = "";
    if (images.length === 0) {
      galleryContainer.innerHTML = `<p class="col-span-4 text-center py-10 text-gray-400">No snapshots found for this candidate.</p>`;
      return;
    }
    // Create a global array to track selected snaps for this session
    window.currentSelectedSnaps = [];

    images.forEach((base64Data, index) => {
      // Create a wrapper for the image and the X icon
      const imgContainer = document.createElement("div");
      imgContainer.className =
        "relative cursor-pointer transition-transform hover:scale-105 w-full";

      const img = document.createElement("img");
      img.src = base64Data;
      img.className =
        "w-full aspect-video object-cover rounded-md shadow-md border-4 border-transparent transition-colors";

      // Create a red X badge (hidden by default)
      const badge = document.createElement("div");
      badge.className =
        "absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold hidden shadow-md border border-white text-xs";
      badge.innerHTML = "X";

      imgContainer.appendChild(img);
      imgContainer.appendChild(badge);

      // Add toggle click logic
      imgContainer.addEventListener("click", () => {
        const snapName = `Snap_${index + 1}`;
        const snapIdx = window.currentSelectedSnaps.indexOf(snapName);

        if (snapIdx > -1) {
          // Deselect if already clicked
          window.currentSelectedSnaps.splice(snapIdx, 1);
          img.classList.remove("border-red-600");
          img.classList.add("border-transparent");
          badge.classList.add("hidden");
        } else {
          // Select
          window.currentSelectedSnaps.push(snapName);
          img.classList.remove("border-transparent");
          img.classList.add("border-red-600");
          badge.classList.remove("hidden");
        }
      });

      galleryContainer.appendChild(imgContainer);
    });
  } catch (error) {
    console.error("Error fecthing snapshots:", error);
  }
};

// Update proctor status function
const proctorStatusModalOverlay = document.getElementById(
  "proctorStatusModalOverlay",
);
const statusIcon = document.getElementById("statusIcon");
const statusTitle = document.getElementById("statusTitle");
const statusMessage = document.getElementById("statusMessage");
// admin.js - Updated updateProctorStatus function
const updateProctorStatus = async (newStatus) => {
  const appId = snapsModalAppID.textContent;
  const student = rawProctoringData.find((s) => s["Student ID"] === appId);

  validateBtn.disabled = true;
  inValidateBtn.disabled = true;

  // Change "Validate" to "Validated" for the database string
  const databaseStatus =
    newStatus === "Validate" ? "Validated" : "In-Validated";

  if (newStatus === "Validate") validateBtn.textContent = "Validating...";
  else inValidateBtn.textContent = "In-validating...";

  try {
    const remarks = document.getElementById("proctorRemarks").value.trim();
    const violationProof = window.currentSelectedSnaps
      ? window.currentSelectedSnaps.join(", ")
      : "";

    const response = await fetch(resultsScriptUrl, {
      method: "POST",
      // Apps Script needs this to be sent as a simple string or standard POST
      body: JSON.stringify({
        action: "updateProctorStatus",
        applicationId: appId,
        examType: student["Exam Type"],
        attemptNumber: student["Attempt Number"] || 1,
        proctorStatus: databaseStatus,
        feedback: remarks,
        violationProof: violationProof,
        adminName:
          JSON.parse(localStorage.getItem("adminUser"))?.username || "Admin",
      }),
    });

    const result = await response.json();

    if (result.status === "success") {
      // Show Success Modal with correct text
      if (newStatus === "Validate") {
        statusIcon.textContent = "✅";
        statusTitle.textContent = "Validated";
        statusTitle.className = "text-2xl font-bold text-green-600 mb-2";
        statusMessage.textContent = `The student's test has been validated.`;
      } else {
        statusIcon.textContent = "🚫";
        statusTitle.textContent = "In-Validated";
        statusTitle.className = "text-2xl font-bold text-red-600 mb-2";
        statusMessage.textContent = `The student's test has been in-validated.`;
      }

      proctorStatusModalOverlay.classList.remove("hidden");
      fetchProctoringData(); // Refresh table
    } else {
      alert("Error updating status: " + result.message);
    }
  } catch (error) {
    console.error("Update failed:", error);
    alert(
      "Network error. Please check if your script is deployed as 'Anyone'.",
    );
  } finally {
    validateBtn.disabled = false;
    inValidateBtn.disabled = false;
    validateBtn.textContent = "Validate";
    inValidateBtn.textContent = "In-Validate";
  }
};

// CLose proctor status modal
const closeStatusModal = () => {
  proctorStatusModalOverlay.classList.add("hidden");
  closeGalleryModal();
};

// Close Gallery modal function
const closeGalleryModal = () => {
  galleryModalOverlay.classList.add("hidden");
  galleryContainer.innerHTML = "";
  window.currentSelectedSnaps = []; // Reset snaps
  const remarksBox = document.getElementById("proctorRemarks");
  if (remarksBox) remarksBox.value = ""; // Clear text
};

// -----------------------------
// STUDENT STATS SCREEN
// -----------------------------

// DOM Elements
const statsSearchInput = document.getElementById("studentStatGlobalSearch");
const statsDateFilter = document.getElementById("studentStatDateFilter");
const statsTableBody = document.getElementById("statsTableBody");
const statsTableView = document.getElementById("statsTableView");
const statsDetailView = document.getElementById("statsDetailView");
const studentProfileContent = document.getElementById("studentProfileContent");
const backToStatsBtn = document.getElementById("backToStatsBtn");

// Render Student Stats table function
const renderStudentStatsTable = () => {
  const searchTerm = statsSearchInput.value.toLowerCase().trim();
  const dateRange = statsDateFilter.value;
  const now = new Date();

  // Filter Logic
  let filteredData = rawProctoringData.filter((student) => {
    // Global Search Logic
    const matchesSearch =
      student["Student Name"].toLowerCase().includes(searchTerm) ||
      student["Student ID"].toLowerCase().includes(searchTerm);

    // Date Filter Logic
    const studentDate = new Date(student.Timestamp);
    let matchesDate = false;

    if (dateRange === "all") {
      matchesDate = true;
    } else if (dateRange === "today") {
      matchesDate = studentDate.toDateString() === now.toDateString();
    } else if (dateRange === "yesterday") {
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      matchesDate = studentDate.toDateString() === yesterday.toDateString();
    } else if (dateRange === "lastWeek") {
      const lastWeek = new Date();
      lastWeek.setDate(now.getDate() - 7);
      matchesDate = studentDate >= lastWeek;
    } else if (dateRange === "lastMonth") {
      const lastMonth = new Date();
      lastMonth.setMonth(now.getMonth() - 1);
      matchesDate = studentDate >= lastMonth;
    }

    return matchesSearch && matchesDate;
  });

  // Sorting Logic: Newest to Oldest (Reverse Chronological)
  filteredData.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));

  // DOM Injection
  statsTableBody.innerHTML = "";

  if (filteredData.length === 0) {
    statsTableBody.innerHTML = `<tr><td colspan="7" class="py-10 text-gray-400">No matching records found.</td></tr>`;
    return;
  }

  filteredData.forEach((student) => {
    const row = document.createElement("tr");
    row.className =
      "hover:bg-purple-50 border-b border-gray-100 transition-colors";

    // Format Date for display
    const formattedDate = new Date(student.Timestamp).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // Proctor Status Colors
    const pStatus = student["Proctor Status"] || "Pending";
    const pColor =
      pStatus === "Validated"
        ? "text-green-600"
        : pStatus === "In-Validated"
          ? "text-red-600"
          : "text-yellow-600";

    // Build table rows
    row.innerHTML = `
      <td class="p-3 text-gray-500 font-mono text-xs">${formattedDate}</td>
      <td class="p-3 text-left">
        <span 
          class="text-purple-600 font-semibold cursor-pointer hover:underline" 
          onclick="openStudentDetail('${student["Student ID"]}')"
        >
          ${student["Student Name"]}
        </span>
      </td>
      <td class="p-3 text-gray-600">${student["Student ID"]}</td>
      <td class="p-3"><span class="px-2 py-1 bg-gray-100 rounded-full text-[10px] uppercase font-bold">${student["Exam Type"]}</span></td>
      <td class="p-3 font-bold text-gray-700">${student.Score} / 30</td>
      <td class="p-3">
        <span class="${student.Status === "Terminated" ? "text-red-600 font-bold" : "text-gray-600"}">
          ${student.Status}
        </span>
      </td>
      <td class="p-3 font-bold ${pColor}">${pStatus}</td>
    `;
    statsTableBody.appendChild(row);
  });
};

// Attach Event Listeners
statsSearchInput.addEventListener("input", renderStudentStatsTable);
statsDateFilter.addEventListener("change", renderStudentStatsTable);

// Render Student Detail view function
const openStudentDetail = (appId) => {
  const student = rawProctoringData.find((s) => s["Student ID"] === appId);
  if (!student) return;

  statsTableView.classList.add("hidden");
  statsDetailView.classList.remove("hidden");

  // Time Taken
  let displayTime = student["Time Taken"];

  if (displayTime) {
    let timeStr = "";

    if (displayTime instanceof Date || !isNaN(Date.parse(displayTime))) {
      // Converts the 1899 date object to "HH:MM:SS"
      timeStr = new Date(displayTime).toTimeString().split(" ")[0];
    } else if (typeof displayTime === "string" && displayTime.includes("T")) {
      // Converts the ISO string "1899-12-30T05:45:00.000Z" to "HH:MM:SS"
      timeStr = displayTime.split("T")[1].split(".")[0];
    } else {
      timeStr = String(displayTime);
    }
    const parts = timeStr.split(":");
    if (parts.length >= 2) {
      displayTime = parts[0] + ":" + parts[1];
    } else {
      displayTime = timeStr;
    }
  } else {
    displayTime = "00:00";
  }

  const pStatus = student["Proctor Status"] || "Review Pending";
  const pColor =
    pStatus === "Validated"
      ? "text-green-600"
      : pStatus === "In-Validated"
        ? "text-red-600"
        : "text-yellow-600";

  studentProfileContent.innerHTML = `
    <div class="flex flex-col gap-6">
      <div class="border-b pb-4 flex justify-between items-end">
        <div>
          <h2 class="text-3xl font-bold text-purple-900">${student["Student Name"]}</h2>
          <p class="text-gray-500 font-mono text-sm">Student ID: ${student["Student ID"]}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-400 uppercase font-bold">Proctor Status</p>
          <p class="text-xl font-black ${pColor}">${pStatus}</p>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div class="bg-purple-50 p-6 rounded-xl flex flex-col items-center justify-center shadow-sm border border-purple-100">
          <p class="text-xs uppercase text-purple-400 font-bold mb-2">Final Score</p>
          <p class="text-5xl font-black text-purple-800">${student.Score} <span class="text-xl text-purple-400">/ ${student["Total Questions"] || 30}</span></p>
        </div>
        <div class="bg-purple-50 p-6 rounded-xl flex flex-col items-center justify-center shadow-sm border border-purple-100">
          <p class="text-xs uppercase text-purple-400 font-bold mb-2">Time Taken</p>
          <p class="text-4xl font-bold text-purple-800">${displayTime}</p>
        </div>
        <div class="bg-purple-50 p-6 rounded-xl flex flex-col items-center justify-center shadow-sm border border-purple-100">
          <p class="text-xs uppercase text-purple-400 font-bold mb-2">Total Violations</p>
          <p class="text-4xl font-bold ${student["Violation Count"] > 0 ? "text-red-500" : "text-purple-800"}">${student["Violation Count"] || 0}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6 mt-4">
        <div class="bg-white p-4 rounded-lg border border-gray-100 shadow-sm space-y-3">
          <h3 class="font-bold text-purple-800 border-b pb-1 flex justify-between items-center">
            Test Performance <span class="text-lg">${student.Percentage}%</span>
          </h3>
          <div class="grid grid-cols-2 gap-y-3 text-sm text-gray-600">
            <p><strong>Attempted:</strong> ${student["Attempted"] || 0} / ${student["Total Questions"] || 30}</p>
            <p><strong>Score:</strong> ${student.Score}</p>
            <p><strong>Exam Type:</strong> ${student["Exam Type"]}</p>
            <p><strong>Question Set:</strong> ${student["Question Set"] || "N/A"}</p>
            <p><strong>Place:</strong> ${student["Place"] || "N/A"}</p>
            <p><strong>Contact:</strong> ${student["Contact"] || "N/A"}</p>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg border border-gray-100 shadow-sm space-y-3">
          <h3 class="font-bold text-purple-800 border-b pb-1">Integrity Activity</h3>
          <div class="text-sm text-gray-600 space-y-2">
            <p><strong>Violation Count:</strong> <span class="px-2 py-0.5 rounded ${student["Violation Count"] > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}">${student["Violation Count"] || 0}</span></p>
            <p><strong>Latest Activity:</strong></p>
            <p class="italic bg-gray-50 p-2 rounded border-l-4 border-purple-300">"${student["Latest Activity"] || "No violations recorded."}"</p>
            <p><strong>Completion Date:</strong> ${new Date(student.Timestamp).toLocaleString("en-GB")}</p>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Function to go back to the table
backToStatsBtn.addEventListener("click", () => {
  statsDetailView.classList.add("hidden");
  statsTableView.classList.remove("hidden");
  studentProfileContent.innerHTML = ""; // Clear memory
});
