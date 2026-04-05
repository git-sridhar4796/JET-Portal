// ----------------------
// UPDATE DOM ELEMENTS
// ----------------------

const { random } = require("nanoid");

// portal screen DOM elements
const loginScreen = document.getElementById("loginScreen");
const instructionsScreen = document.getElementById("instructionsScreen");
const examScreen = document.getElementById("examScreen");
const completionScreen = document.getElementById("completionScreen");
// schedule banner DOM elements
const scheduleBanner = document.getElementById("scheduleBanner");
const scheduleStartTime = document.getElementById("scheduleStartTime");
// login button
const loginBtn = document.getElementById("loginBtn");
// application details DOM elements
const nameTag = document.getElementById("nameTag");
const applicationIdTag = document.getElementById("applicationIdTag");
const emailIdTag = document.getElementById("emailIdTag");
const placeTag = document.getElementById("placeTag");
// update exam details DOM elements
const subjectTag = document.getElementById("subjectTag");
const marksTag = document.getElementById("marksTag");
const timeTag = document.getElementById("timeTag");
// load test stats DOM elements
const totalTag = document.getElementById("totalTag");
const attemptedTag = document.getElementById("attemptedTag");
const remainingTag = document.getElementById("remainingTag");
// submit modal DOM elements
const modalOverlay = document.getElementById("modalOverlay");
const finalTotalTag = document.getElementById("finalTotalTag");
const finalAttemptedTag = document.getElementById("finalAttemptedTag");
const finalRemainingTag = document.getElementById("finalRemainingTag");
const confirmSubmitBtn = document.getElementById("confirmSubmitBtn");
const reviewAgainBtn = document.getElementById("reviewAgainBtn");
// proctoring DOM elements
const proctorVideo = document.getElementById("proctorVideo");
const proctorCanvas = document.getElementById("proctorCanvas");
const allowCameraBtn = document.getElementById("allowCameraBtn");
const cameraModal = document.getElementById("cameraModal");
const modalVideo = document.getElementById("modalVideo");
const confirmCameraAccessBtn = document.getElementById(
  "confirmCameraAccessBtn",
);

// testing toggles
// loginScreen.classList.remove("hidden");
// instructionsScreen.classList.add("hidden");
// completionScreen.classList.add("hidden");
// examScreen.classList.add("hidden");

// global variables
let totalTime = 0; // hold total time in seconds globally
let userAnswers = {}; // hold user answers globally
let studentData = {}; // hold student data globally
const examStartTime = new Date("2026-03-14T21:25").getTime(); // 14.03.2026 - 5.30pm (YYYY-MM-DDTHH:MM:SS)
const resultsScriptUrl =
  "https://script.google.com/macros/s/AKfycbx4lXCelHi0mIc72wpRFoC4GwHg9fDvjsz4F71ejsU-tJVEUz29RXdnjkntOec53gY/exec";

// Schedule banner function
const updatePortalStatus = () => {
  const now = new Date().getTime();
  if (now < examStartTime) {
    scheduleBanner.classList.remove("-translate-y-full", "hidden");
    loginBtn.disabled = true;
    loginBtn.classList.add("opacity-50", "cursor-not-allowed");
  } else {
    scheduleBanner.classList.add("-translate-y-full");
    loginBtn.disabled = false;
    loginBtn.classList.remove("opacity-50", "cursor-not-allowed");
    setTimeout(() => {
      scheduleBanner.classList.add("hidden");
    }, 1000);
  }
};
setInterval(updatePortalStatus, 1000); //check every 1 sec for portal live status

// ---------------------------
// FETCH EXAM DATA
// ---------------------------

let masterExamData = [];
const scriptUrl =
  "https://script.google.com/macros/s/AKfycbxZJ5GQRN_rvcL1b5gpbple_9QUdEJKKNBJ5PtYlp55fCnLsCCgQAAIJFhZGBngkez7nA/exec";
async function fetchExamData() {
  try {
    const response = await fetch(scriptUrl + "?action=getQuestions");
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    masterExamData = await response.json();
  } catch (error) {
    console.error("Failed to load data from database", error);
  }
}
document.addEventListener("DOMContentLoaded", fetchExamData);

// shuffle function
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

// ----------------------------
// PREPARE EXAM INFO FUNCTION
// ----------------------------
let activeExamSet = null;
const prepareExamInfo = () => {
  const matchingSets = masterExamData.filter(
    (set) => set.examType.trim() === studentData.examType.trim(),
  );

  if (matchingSets.length === 0) {
    alert(
      `No question sets found for ${studentData.examType}. Please contact support.`,
    );
    return;
  }

  const randomSet = Math.floor(Math.random() * matchingSets.length);
  activeExamSet = matchingSets[randomSet];
  shuffle(activeExamSet.questions);
  // update test details
  subjectTag.textContent =
    activeExamSet.testName + " " + activeExamSet.examType;
  marksTag.textContent = activeExamSet.totalMarks;
  totalTime = activeExamSet.duration * 60; // convert minutes to seconds
  if (activeExamSet.duration <= 60) {
    timeTag.textContent =
      activeExamSet.duration / 60 +
      " hour" +
      " (" +
      activeExamSet.duration +
      " minutes)";
  } else {
    timeTag.textContent =
      activeExamSet.duration / 60 +
      " hours" +
      " (" +
      activeExamSet.duration +
      " minutes)";
  }
  const totalQuestions = activeExamSet.questions.length;
  totalTag.textContent = totalQuestions;
  attemptedTag.textContent = 0;
  remainingTag.textContent = totalQuestions;

  loadQuestions();
};

// ---------------------
// TIMER FUNCTION
// ---------------------
timerContainer = document.getElementById("timerContainer");
timer = document.getElementById("timer");
timerHours = document.getElementById("hours");
timerMinutes = document.getElementById("minutes");
timerSeconds = document.getElementById("seconds");
let timerInterval;

function startTimer(totalTime) {
  let timeLeft = totalTime;
  timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      confirmSubmit();
    } else {
      timeLeft--;
      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const seconds = timeLeft % 60;
      timerHours.textContent = hours.toString().padStart(2, "0");
      timerMinutes.textContent = minutes.toString().padStart(2, "0");
      timerSeconds.textContent = seconds.toString().padStart(2, "0");
      if (timeLeft <= 120) {
        timer.classList.add(
          "text-red-600",
          "font-bold",
          "animate-pulse",
          "animate-heartbeat",
        );
        timer.style.animationDuration = "0.5s";
      } else if (timeLeft <= 300) {
        timer.classList.add(
          "text-red-600",
          "font-bold",
          "animate-pulse",
          "animate-heartbeat",
        );
        timer.style.animationDuration = "1s";
      } else if (timeLeft <= 600) {
        timer.classList.add("text-red-600", "font-bold", "animate-pulse");
        timer.classList.remove("animate-heartbeat");
        timer.style.animationDuration = "2s";
      }
    }
  }, 1000);
}

// ------------------------------
// LOAD QUESTIONS & OPTIONS
// ------------------------------

// load questions and options
testContainer = document.getElementById("testContainer");
function loadQuestions() {
  // shuffle questions
  shuffle(activeExamSet.questions);
  activeExamSet.questions.forEach((question, index) => {
    // create question container
    const questionContainer = document.createElement("div");
    questionContainer.classList.add(
      "mb-2",
      "p-4",
      "border",
      "rounded-md",
      "shadow-sm",
      "bg-purple-100",
    );
    // create question text
    const questionText = document.createElement("p");
    questionText.textContent = `${index + 1}. ${question.text}`;
    questionText.classList.add("font-semibold", "mb-2");
    questionContainer.append(questionText);
    // create options container
    const optionsContainer = document.createElement("ul");
    questionContainer.append(optionsContainer);
    // create options
    question.options.forEach((option) => {
      const optionItem = document.createElement("li");
      optionItem.textContent = option;
      optionItem.classList.add(
        "mb-1",
        "p-2",
        "shadow-sm",
        "rounded-md",
        "cursor-pointer",
        "bg-purple-50",
        "hover:bg-purple-300",
        "active:bg-purple-500",
        "hover:shadow-sm",
        "transition-colors",
        "duration-200",
        "ease-in-out",
      );
      optionItem.addEventListener("click", () => {
        // Deselect all options
        optionsContainer.querySelectorAll("li").forEach((li) => {
          li.classList.remove("bg-purple-500", "text-white");
          li.classList.add("bg-purple-50", "hover:bg-purple-300");
        });
        // Select the clicked option
        optionItem.classList.remove("bg-purple-50", "hover:bg-purple-300");
        optionItem.classList.add("bg-purple-500", "text-white");

        // Store the user's answer
        userAnswers[question.id] = option;
        // update test stats
        attemptedTag.textContent = Object.keys(userAnswers).length;
        remainingTag.textContent =
          activeExamSet.questions.length - Object.keys(userAnswers).length;
      });
      optionsContainer.append(optionItem);
    });
    testContainer.append(questionContainer);
  });
  // create submit button
  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Submit Test";
  submitBtn.classList.add(
    "px-4",
    "py-2",
    "bg-purple-600",
    "hover:bg-purple-500",
    "active:scale-95",
    "text-white",
    "rounded-md",
    "shadow-md",
    "block",
    "mx-auto",
    "mt-4",
    "transition",
  );
  submitBtn.addEventListener("click", showModal);
  testContainer.append(submitBtn);
}

// --------------------------------
// COMPLETION SCREEN
// --------------------------------

// completion screen function
const loadCompletionScreen = () => {
  examScreen.classList.add("hidden");
  completionScreen.classList.remove("hidden");
  hideModal();
};

// show submit modal function
const showModal = () => {
  finalTotalTag.textContent = activeExamSet.questions.length;
  finalAttemptedTag.textContent = Object.keys(userAnswers).length;
  finalRemainingTag.textContent =
    activeExamSet.questions.length - Object.keys(userAnswers).length;
  modalOverlay.classList.remove("hidden");
  confirmSubmitBtn.addEventListener("click", confirmSubmit);
  reviewAgainBtn.addEventListener("click", hideModal);
};

// review again function
const hideModal = () => {
  modalOverlay.classList.add("hidden");
};

// confirm submit function
const confirmSubmit = async () => {
  clearInterval(timerInterval); // stop the timer
  clearInterval(proctorTimeout); // stop the snapshot
  // stop video
  const stream = proctorVideo.srcObject;
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  // calculate final score & percentage
  let finalScore = 0;
  activeExamSet.questions.forEach((currentQuestion) => {
    const userAnswer = userAnswers[currentQuestion.id];
    const correctAnswer =
      currentQuestion.options[currentQuestion.correctAnswer - 1];
    if (!userAnswer) {
      return;
    } else if (userAnswer === correctAnswer) {
      finalScore++;
    }
  });
  const finalPercent = (
    (finalScore / activeExamSet.questions.length) *
    100
  ).toFixed(2);

  // update score in student data object
  studentData.score = finalScore;
  studentData.percent = finalPercent;
  studentData.setID = activeExamSet.setID;
  studentData.attemptedCount = Object.keys(userAnswers).length;
  studentData.totalQuestions = activeExamSet.questions.length;
  const finalStatus =
    studentData.status == "Terminated" ? "Terminated" : "Completed";
  try {
    confirmSubmitBtn.textContent = "Saving Results...";
    confirmSubmitBtn.classList.add("opacity-50", "cursor-not-allowed");
    reviewAgainBtn.classList.add("opacity-50", "cursor-not-allowed");
    const finalMessage =
      finalStatus == "Terminated"
        ? "Auto-Submitted due to maximum violations"
        : "Successfully submitted the exam";
    await syncExamStatus(finalStatus, finalMessage);
    loadCompletionScreen();
  } catch (error) {
    console.error("Error!", error.message);
  }
};

// -----------------------------------------
// PROCTORING FUNCTIONS
// -----------------------------------------
let violations = 0;
let lastViolationTime = 0; // Cooldown timer to prevent double-strikes

// Get the warning modal elements
const warningModal = document.getElementById("warningModal");
const violationText = document.getElementById("violationText");
const returnToExamBtn = document.getElementById("returnToExamBtn");

// Function to handle all violations
const triggerViolation = (reason) => {
  const currentTime = new Date().getTime();

  // 1-second cooldown to prevent double-strikes when minimizing
  if (currentTime - lastViolationTime < 1000) return;
  lastViolationTime = currentTime;

  violations++;

  if (violations < 3) {
    violationText.innerText = `Violation: ${violations}/3.\nYour exam will be auto-submitted on the 3rd violation.`;
    warningModal.classList.remove("hidden");
    syncExamStatus("Active", `Warning ${violations} : ${reason}`);
  } else if (violations == 3) {
    alert(
      `FINAL WARNING EXCEEDED!\n\nYou have left the exam window ${violations} times.\nThe exam has been auto-submitted.`,
    );
    studentData.status = "Terminated";
    confirmSubmit();
  }
};

// camera monitoring via screenshots
const proctoringUrl =
  "https://script.google.com/macros/s/AKfycbyy_Hyk8p9vm8tbaySBJ1J-W0Iba29CjVMhcnvolrFGZewlO9J8ajgf8gk36VXsop63/exec";
let proctorTimeout;
let isCameraVerified = false;

allowCameraBtn.addEventListener("click", async () => {
  cameraModal.classList.remove("hidden");

  try {
    // Camera access request
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    // Assign the stream to the MODAL video element
    modalVideo.srcObject = stream;

    // Assign to background proctoring video
    proctorVideo.srcObject = stream;

    console.log("Camera stream started in modal.");
  } catch (error) {
    console.error("Camera Access Error:", error);
    alert("Camera access is required. Please check your browser permissions.");
    cameraModal.classList.add("hidden");
  }
});

confirmCameraAccessBtn.addEventListener("click", () => {
  isCameraVerified = true;
  cameraModal.classList.add("hidden");
  allowCameraBtn.textContent = "Camera Verified ✓";
  allowCameraBtn.classList.remove(
    "border-purple-600",
    "hover:bg-purple-500",
    "active:scale-95",
    "hover:text-white",
  );
  allowCameraBtn.classList.add("bg-green-500", "cursor-default", "text-black");
  allowCameraBtn.disabled = true;
  checkStartExamStatus();
});

const takeSnapshot = async () => {
  // Safety check
  if (proctorVideo.videoWidth === 0 || proctorVideo.videoHeight === 0) {
    return;
  }

  // Size canvas to video
  proctorCanvas.width = proctorVideo.videoWidth;
  proctorCanvas.height = proctorVideo.videoHeight;

  // Take snapshot
  const snap = proctorCanvas.getContext("2d");
  snap.drawImage(proctorVideo, 0, 0, proctorCanvas.width, proctorCanvas.height);

  // 4. Convert the canvas into a compressed text string (0.5 = 50% JPEG quality)
  const imageData = proctorCanvas.toDataURL("image/jpeg", 0.5);

  // Build data to be sent to drive
  const payload = {
    applicationId: studentData.applicationId,
    timestamp: new Date().getTime(),
    image: imageData,
  };

  // 6. Upload to Drive via Google Apps Script
  try {
    await fetch(proctoringUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(payload),
    });
    console.log("Snapshot sent to drive");
  } catch (error) {
    console.error("Background snapshot upload failed:", error);
  }
};

const scheduleRandomSnapshot = () => {
  takeSnapshot();
  const randomInterval = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
  proctorTimeout = setTimeout(scheduleRandomSnapshot, randomInterval);
};

const startProctoring = () => {
  enterFullScreen();
  scheduleRandomSnapshot();
  // proctorInterval = setInterval(takeSnapshot, 30000);
  // Tab switching or minimizing
  document.addEventListener("visibilitychange", () => {
    if (
      document.visibilityState === "hidden" &&
      !examScreen.classList.contains("hidden")
    ) {
      triggerViolation("Switched browser tabs");
    }
  });

  // Full screen exit (Esc key)
  document.addEventListener("fullscreenchange", () => {
    if (
      !document.fullscreenElement &&
      !examScreen.classList.contains("hidden")
    ) {
      triggerViolation("Exited full screen mode");
    }
  });

  // Focus loss (Alt+Tab)
  window.addEventListener("blur", () => {
    if (!examScreen.classList.contains("hidden")) {
      triggerViolation("Exam window lost focus (clicked outside exam)");
    }
  });
};

// full screen mode
const element = document.documentElement;
const enterFullScreen = () => {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }

  // Prevent Right-Click
  document.addEventListener("contextmenu", (event) => event.preventDefault());

  // Prevent Copying Text
  document.addEventListener("copy", (event) => {
    event.preventDefault();
    alert("Copying text is strictly disabled during the exam.");
  });

  // Prevent Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+C)
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "F12" ||
      (event.ctrlKey && event.shiftKey && event.key === "I") ||
      (event.ctrlKey && event.key === "c")
    ) {
      event.preventDefault();
    }
  });
};

// Warn user before accidentally refreshing or closing the tab
window.addEventListener("beforeunload", (e) => {
  if (!examScreen.classList.contains("hidden")) {
    e.preventDefault();
    e.returnValue = "";
  }
});

// return to exam button click event
returnToExamBtn.addEventListener("click", () => {
  warningModal.classList.add("hidden");
  enterFullScreen();
});

// update student data function
const updateStudentData = (name, appId, email, contact, place, examType) => {
  studentData.name = name;
  studentData.applicationId = appId;
  studentData.emailId = email;
  studentData.contact = contact;
  studentData.place = place;
  studentData.examType = examType;
  studentData.date = new Date().toLocaleString();
  studentData.status = "Pending";
  studentData.violationCount = 0;
  violations = 0;
};

// -----------------------------------------
// LOGIN, INSTRUCTIONS & START EXAM FUNCTIONS
// -----------------------------------------
// login form submission
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!loginForm.checkValidity()) {
    return;
  }
  // get form values
  const nameInput = document.getElementById("nameInput").value;
  const applicationIdInput =
    document.getElementById("applicationIdInput").value;
  const emailIdInput = document.getElementById("emailIdInput").value;
  const contactInput = document.getElementById("contactInput").value;
  const placeInput = document.getElementById("placeInput").value;
  const examType = document.getElementById("examTypeSelect").value;

  // update applicant details
  nameTag.textContent = nameInput;
  applicationIdTag.textContent = applicationIdInput;
  emailIdTag.textContent = emailIdInput;
  placeTag.textContent = placeInput;

  // hide login screen and show exam screen
  loginScreen.classList.add("hidden");
  instructionsScreen.classList.remove("hidden");

  // update student data object
  updateStudentData(
    nameInput,
    applicationIdInput,
    emailIdInput,
    contactInput,
    placeInput,
    examType,
  );
  prepareExamInfo();
  console.log(studentData);
});

// instructions screen functions
// get DOM elements
const instructionsAgreeCheckbox = document.getElementById(
  "instructionsAgreeCheckbox",
);
const startExamBtn = document.getElementById("startExamBtn");

// check exam start button status
const checkStartExamStatus = () => {
  if (instructionsAgreeCheckbox.checked && isCameraVerified) {
    startExamBtn.disabled = false;
    startExamBtn.classList.remove("opacity-50", "cursor-not-allowed");
  } else {
    startExamBtn.disabled = true;
    startExamBtn.classList.add("opacity-50", "cursor-not-allowed");
  }
};

instructionsAgreeCheckbox.addEventListener("change", checkStartExamStatus);

// -----------------
// SYNC EXAM STATUS
// -----------------
const syncExamStatus = async (currentStatus, activityMessage = "") => {
  studentData.status = currentStatus;
  studentData.violationCount = violations;
  studentData.latestActivity = activityMessage;
  try {
    await fetch(resultsScriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(studentData),
    });
    console.log("Sending Data", studentData);
  } catch (error) {
    console.error("Failer to sync stuatus", error);
  }
};

// ------------------------------
// START EXAM
// ------------------------------
startExamBtn.addEventListener("click", () => {
  instructionsScreen.classList.add("hidden");
  examScreen.classList.remove("hidden");
  window.scrollTo(0, 0);
  startTimer(totalTime);
  startProctoring();
  syncExamStatus("Active", "Started the exam");
});
