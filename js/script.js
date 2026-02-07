/* =====================================================
   Utility Functions
   ===================================================== */

// Get data from LocalStorage
function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Save data to LocalStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

/* =====================================================
   LOG HEALTH DATA (log.html)
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const logForm = document.querySelector("form");

    if (logForm && logForm.querySelector("input[type='date']")) {
        logForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const entry = {
                date: logForm.querySelector("input[type='date']").value,
                weight: logForm.querySelectorAll("input")[1].value,
                systolic: logForm.querySelectorAll("input")[2].value,
                diastolic: logForm.querySelectorAll("input")[3].value,
                heartRate: logForm.querySelectorAll("input")[4].value,
                steps: logForm.querySelectorAll("input")[5].value,
                sleep: logForm.querySelectorAll("input")[6].value,
                water: logForm.querySelectorAll("input")[7].value
            };

            const records = getData("healthRecords");
            records.push(entry);
            saveData("healthRecords", records);

            alert("Health data saved successfully.");
            logForm.reset();
        });
    }
});

/* =====================================================
   PROFILE & GOALS (profile.html)
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const profileForm = document.querySelector("form");

    if (profileForm && profileForm.querySelector("input[placeholder]") === null) {
        profileForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const profile = {
                age: profileForm.querySelectorAll("input")[0].value,
                height: profileForm.querySelectorAll("input")[1].value,
                stepGoal: profileForm.querySelectorAll("input")[2].value,
                targetWeight: profileForm.querySelectorAll("input")[3].value,
                targetSleep: profileForm.querySelectorAll("input")[4].value
            };

            saveData("userProfile", profile);
            alert("Profile saved successfully.");
        });
    }
});

/* =====================================================
   DASHBOARD DATA (dashboard.html)
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const dashboard = document.querySelector("main");

    if (dashboard && window.location.pathname.includes("dashboard")) {
        const records = getData("healthRecords");

        if (records.length === 0) return;

        const latest = records[records.length - 1];
        const listItems = dashboard.querySelectorAll("li");

        if (listItems.length >= 5) {
            listItems[0].textContent = `Weight: ${latest.weight || "-"} kg`;
            listItems[1].textContent = `Blood Pressure: ${latest.systolic || "-"} / ${latest.diastolic || "-"} mmHg`;
            listItems[2].textContent = `Heart Rate: ${latest.heartRate || "-"} bpm`;
            listItems[3].textContent = `Steps Today: ${latest.steps || "-"}`;
            listItems[4].textContent = `Sleep Hours: ${latest.sleep || "-"}`;
        }
    }
});

/* =====================================================
   HISTORY TABLE (history.html)
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("history")) {
        const tableBody = document.querySelector("tbody");
        const records = getData("healthRecords");

        if (!tableBody || records.length === 0) return;

        tableBody.innerHTML = "";

        records.forEach(record => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${record.date}</td>
                <td>${record.weight || "-"}</td>
                <td>${record.systolic || "-"} / ${record.diastolic || "-"}</td>
                <td>${record.steps || "-"}</td>
                <td>${record.sleep || "-"}</td>
            `;
            tableBody.appendChild(row);
        });
    }
});

/* =====================================================
   PERSONALISED HEALTH TIPS (tips.html)
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("tips")) {
        const tipList = document.querySelector("ul");
        const records = getData("healthRecords");
        const profile = getData("userProfile");

        if (!tipList || records.length === 0) return;

        tipList.innerHTML = "";

        const latest = records[records.length - 1];

        if (latest.sleep && latest.sleep < 7) {
            tipList.innerHTML += "<li>Try to get at least 7–8 hours of sleep for better recovery.</li>";
        }

        if (latest.steps && profile.stepGoal && latest.steps < profile.stepGoal) {
            tipList.innerHTML += "<li>Increase daily physical activity to meet your step goal.</li>";
        }

        if (latest.water && latest.water < 2) {
            tipList.innerHTML += "<li>Increase water intake to stay properly hydrated.</li>";
        }

        if (latest.systolic && latest.systolic > 130) {
            tipList.innerHTML += "<li>Monitor blood pressure and consider reducing sodium intake.</li>";
        }

        if (tipList.innerHTML === "") {
            tipList.innerHTML = "<li>Great job! Keep maintaining your healthy habits.</li>";
        }
    }
});
