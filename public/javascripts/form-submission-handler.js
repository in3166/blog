(function () {

    function validEmail(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }

    function validateHuman(honeypot) {
        if (honeypot) {  //if hidden form filled up
            console.log("Robot Detected!");
            return true;
        } else {
            console.log("Welcome Human!");
        }
    }

    // get all data in form and return object
    function getFormData(form) {
        var elements = form.elements;
        var honeypot;

        var fields = Object.keys(elements).filter(function (k) {
            if (elements[k].name === "honeypot") {
                honeypot = elements[k].value;
                return false;
            }
            return true;
        }).map(function (k) {
            if (elements[k].name !== undefined) {
                return elements[k].name;
                // special case for Edge's html collection
            } else if (elements[k].length > 0) {
                return elements[k].item(0).name;
            }
        }).filter(function (item, pos, self) {
            return self.indexOf(item) == pos && item;
        });

        var formData = {};
        fields.forEach(function (name) {
            var element = elements[name];

            // singular form elements just have one value
            formData[name] = element.value;

            // when our element has multiple items, get their values
            if (element.length) {
                var data = [];
                for (var i = 0; i < element.length; i++) {
                    var item = element.item(i);
                    if (item.checked || item.selected) {
                        data.push(item.value);
                    }
                }
                formData[name] = data.join(', ');
            }
        });
        // add form-specific values into the data
        formData.formDataNameOrder = JSON.stringify(fields);
        formData.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
        formData.formGoogleSendEmail
            = form.dataset.email || ""; // no email by default

        return { data: formData, honeypot: honeypot };
    }

    function handleFormSubmit(event) {  // handles form submit without any jquery
        event.preventDefault();           // we are submitting via xhr below
        var form = event.target;
        var formData = getFormData(form);
        var data = formData.data;
        console.log("data: ", formData.honeypot);
        // If a honeypot field is filled, assume it was done so by a spam bot.
        if (formData.honeypot) {
            alert("Robot Detected!")
            return false;
        }
        disableAllButtons(form);

        var url = form.action;
        console.log("url: " + url);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        // xhr.withCredentials = true;
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded", "Access-Control-Allow-Origin: *");

        xhr.onload = function () {
            if (xhr.status === 200) {
                console.log(xhr.status);
                alert("전송 완료!");
                window.location.reload();
            } else if (xhr.status === 500) {
                console.log(xhr.status);
                alert("전송 실패");
            } else {
                console.log(xhr.status);
                alert("오류");
            }
        };
        // url encode form data for sending as post data
        var encoded = Object.keys(data).map(function (k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
        }).join('&');
        console.log("encoded: ", encoded);
        xhr.send(encoded);
    }

    function loaded() {
        // bind to the submit event of our form
        var forms = document.querySelectorAll("form.gform");
        for (var i = 0; i < forms.length; i++) {
            forms[i].addEventListener("submit", handleFormSubmit, false);
        }
    };
    document.addEventListener("DOMContentLoaded", loaded, false);

    function disableAllButtons(form) {
        var buttons = form.querySelectorAll("button");
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }
    }

    let openBtn = document.getElementById('toc-toggle');
    if (openBtn) {
        openBtn.addEventListener('click', openCloseToc, false);
    }
})();

function openCloseToc() {
    if (document.getElementById('toc-content').style.display === 'block') {
        document.getElementById('toc-content').style.display = 'none';
        document.getElementById('toc-toggle').innerHTML = '펼치기 <i class="fas fa-caret-down"></i>';
    } else {
        document.getElementById('toc-content').style.display = 'block';
        document.getElementById('toc-toggle').innerHTML = '접기 <i class="fas fa-caret-up"></i>';
    }
}