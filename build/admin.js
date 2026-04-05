// ------------------
// GET DOM ELEMENTS
// ------------------

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

// question bank DOM elements
const uploadQuestionSetCard = document.getElementById("uploadQuestionSetCard");
const excelUpload = document.getElementById("excelUpload");
const downloadSampleCard = document.getElementById("downloadSampleCard");

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
