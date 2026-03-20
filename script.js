

const scriptURL = "https://script.google.com/macros/s/AKfycbzVk6QIp1f-RrreLW-z1Pu1kZnIG6H0iSKK2MT4RAu9yau5RfGA7PoD0T7XD5EdjqM/exec";

function setTodayDate() {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  const submissionDate = document.getElementById("submissionDate");
  const dob = document.getElementById("dob");

  if (submissionDate) {
    submissionDate.value = localDate;
  }

  if (dob) {
    dob.max = localDate;
  }
}

function toggleOtherField(checkId, inputId) {
  const check = document.getElementById(checkId);
  const input = document.getElementById(inputId);

  if (!check || !input) return;

  function updateState() {
    input.disabled = !check.checked;
    if (!check.checked) {
      input.value = "";
      input.classList.remove("error-field");
    }
  }

  check.addEventListener("change", updateState);
  updateState();
}

function getCheckedValues(name) {
  const checked = document.querySelectorAll(`input[name="${name}"]:checked`);
  return Array.from(checked).map(item => item.value).join(", ");
}

function getRadioValue(name) {
  const selected = document.querySelector(`input[name="${name}"]:checked`);
  return selected ? selected.value : "";
}

function showMessage(text, type) {
  const box = document.getElementById("messageBox");
  if (!box) return;

  box.className = "message-box";
  if (type) {
    box.classList.add(type);
  }
  box.textContent = text;
}

function clearErrorHighlights() {
  document.querySelectorAll(".error-field").forEach(el => {
    el.classList.remove("error-field");
  });
}

function markFieldError(field) {
  if (field) {
    field.classList.add("error-field");
  }
}

function validateCheckboxGroup(name, message) {
  const checked = document.querySelectorAll(`input[name="${name}"]:checked`);
  if (checked.length === 0) {
    showMessage(message, "error");
    return false;
  }
  return true;
}

function validateConditionalFields(form) {
  const groupJoinValue = getRadioValue("groupJoin");
  const trainingValue = getRadioValue("training");

  if (groupJoinValue === "हाँ" && !form.groupName.value.trim()) {
    markFieldError(form.groupName);
    showMessage('कृपया "यदि हाँ, नाम" भरें।', "error");
    form.groupName.focus();
    return false;
  }

  if (trainingValue === "हाँ" && !form.trainingOrg.value.trim()) {
    markFieldError(form.trainingOrg);
    showMessage('कृपया "यदि हाँ, संस्था का नाम" भरें।', "error");
    form.trainingOrg.focus();
    return false;
  }

  const otherWorkCheck = document.getElementById("otherWorkCheck");
  const otherWorkText = document.getElementById("otherWorkText");
  if (otherWorkCheck.checked && !otherWorkText.value.trim()) {
    markFieldError(otherWorkText);
    showMessage('कृपया "कार्य करने का स्थान - अन्य" लिखें।', "error");
    otherWorkText.focus();
    return false;
  }

  const otherMarketCheck = document.getElementById("otherMarketCheck");
  const otherMarketText = document.getElementById("otherMarketText");
  if (otherMarketCheck.checked && !otherMarketText.value.trim()) {
    markFieldError(otherMarketText);
    showMessage('कृपया "बाजार - अन्य" लिखें।', "error");
    otherMarketText.focus();
    return false;
  }

  const otherHelpCheck = document.getElementById("otherHelpCheck");
  const otherHelpText = document.getElementById("otherHelpText");
  if (otherHelpCheck.checked && !otherHelpText.value.trim()) {
    markFieldError(otherHelpText);
    showMessage('कृपया "सहायता - अन्य" लिखें।', "error");
    otherHelpText.focus();
    return false;
  }

  return true;
}

function validateForm(form) {
  clearErrorHighlights();

  if (!form.checkValidity()) {
    form.reportValidity();
    showMessage("कृपया सभी आवश्यक जानकारी भरें।", "error");
    return false;
  }

  if (!validateCheckboxGroup("seekha", 'कृपया "3.3. यह शिल्प किससे सीखा?" में कम से कम एक विकल्प चुनें।')) {
    return false;
  }

  if (!validateCheckboxGroup("kaamSthan", 'कृपया "3.4. कार्य करने का स्थान" में कम से कम एक विकल्प चुनें।')) {
    return false;
  }

  if (!validateCheckboxGroup("bazaar", 'कृपया "3.6. उत्पाद किस बाजार में बेचते हैं?" में कम से कम एक विकल्प चुनें।')) {
    return false;
  }

  if (!validateCheckboxGroup("helpType", 'कृपया "4.2. किस प्रकार की सहायता चाहते हैं?" में कम से कम एक विकल्प चुनें।')) {
    return false;
  }

  if (!validateConditionalFields(form)) {
    return false;
  }

  return true;
}

function resetFormExtras() {
  setTimeout(() => {
    setTodayDate();
    clearErrorHighlights();

    const otherInputs = [
      { check: "otherWorkCheck", input: "otherWorkText" },
      { check: "otherMarketCheck", input: "otherMarketText" },
      { check: "otherHelpCheck", input: "otherHelpText" }
    ];

    otherInputs.forEach(item => {
      const check = document.getElementById(item.check);
      const input = document.getElementById(item.input);
      if (check) check.checked = false;
      if (input) {
        input.value = "";
        input.disabled = true;
      }
    });

    const box = document.getElementById("messageBox");
    if (box) {
      box.textContent = "";
      box.className = "message-box";
    }
  }, 0);
}

document.addEventListener("DOMContentLoaded", () => {
  setTodayDate();

  toggleOtherField("otherWorkCheck", "otherWorkText");
  toggleOtherField("otherMarketCheck", "otherMarketText");
  toggleOtherField("otherHelpCheck", "otherHelpText");

  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetFormExtras);
  }

  const form = document.getElementById("surveyForm");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validateForm(form)) {
      return;
    }

    const formData = {
      naam: form.naam.value.trim(),
      pitaPatiNaam: form.pitaPatiNaam.value.trim(),
      janmTithi: form.janmTithi.value,
      ling: getRadioValue("ling"),
      jaati: getRadioValue("jaati"),
      shikshaStar: form.shikshaStar.value.trim(),
      samparkNumber: form.samparkNumber.value.trim(),
      aadhar: form.aadhar.value.trim(),
      email: form.email.value.trim(),
      gram: form.gram.value.trim(),
      post: form.post.value.trim(),
      tehsil: form.tehsil.value.trim(),
      jila: form.jila.value.trim(),
      rajya: form.rajya.value.trim(),
      pincode: form.pincode.value.trim(),
      vartmanPata: form.vartmanPata.value.trim(),
      mukhyaShilp: form.mukhyaShilp.value.trim(),
      anubhav: form.anubhav.value.trim(),
      kisSeSikha: form.kisSeSikha.value.trim(),
      seekha: getCheckedValues("seekha"),
      kaamSthan: getCheckedValues("kaamSthan"),
      otherWorkText: form.otherWorkText.value.trim(),
      groupJoin: getRadioValue("groupJoin"),
      groupName: form.groupName.value.trim(),
      bazaar: getCheckedValues("bazaar"),
      otherMarketText: form.otherMarketText.value.trim(),
      training: getRadioValue("training"),
      trainingOrg: form.trainingOrg.value.trim(),
      helpType: getCheckedValues("helpType"),
      otherHelpText: form.otherHelpText.value.trim(),
      bankName: form.bankName.value.trim(),
      accountNumber: form.accountNumber.value.trim(),
      ifsc: form.ifsc.value.trim(),
      accountHolderName: form.accountHolderName.value.trim(),
      submissionDate: form.submissionDate.value,
      signature: form.signature.value.trim()
    };

    showMessage("डेटा सेव हो रहा है...", "info");

    if (scriptURL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
      showMessage("पहले script.js में अपनी Google Apps Script Web App URL डालें।", "error");
      return;
    }

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(formData)
      });

      const resultText = await response.text();
      let result = {};

      try {
        result = JSON.parse(resultText);
      } catch {
        result = { success: false, message: "सर्वर से सही response नहीं मिला।" };
      }

      if (result.success) {
        showMessage("फॉर्म सफलतापूर्वक सबमिट हो गया।", "success");
        form.reset();
        resetFormExtras();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        showMessage(result.message || "डेटा सेव नहीं हुआ।", "error");
      }
    } catch (error) {
      showMessage("सबमिट करते समय त्रुटि आई: " + error.message, "error");
    }
  });
});
