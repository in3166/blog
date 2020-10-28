window.onload = function () {
    //메뉴 - 사용자 이메일 리스트

    const guestDeleteConfirm = document.getElementById("guestDeleteConfirm");
    if (guestDeleteConfirm) {
        if (guestDeleteConfirm.value === "true")
            alert("비밀번호를 확인하세요.");
    }
    const guestDel = document.getElementsByName("guestDel");
    if (guestDel) {
        for (let i = 0; i < guestDel.length; i++) {
            guestDel[i].addEventListener("click", guestPwModalOpen, false);

        }
    }

    let guestModalDelBtn = document.getElementById("guestModalDelBtn");
    if (guestModalDelBtn) {
        guestModalDelBtn.addEventListener("click", guestModalDel, false);

    }
}

// 단순 submit
function post(URL, PARAMS) {
    let temp = document.createElement("form");
    temp.action = URL;
    temp.method = "post";
    temp.style.display = "none";
    for (let x in PARAMS) {
        let opt = document.createElement("textarea");
        opt.name = x;
        opt.value = PARAMS[x];
        temp.appendChild(opt);
    }
    document.body.appendChild(temp);
    temp.submit();
    //return temp;
}

function guestPwModalOpen() {
    let value = this.value;
    console.log(value);
    $(document).off('focusin.modal'); //삭제 모달 오픈 시 텍스트 선택 불가 해결 - 모달에 포커스가 있어서
    let guestDelModal = document.getElementById("guestDelModal");
    // let guestModalId = document.getElementById("guestModalId");
    let span = document.getElementById("guestClose");
    //let modal = document.getElementById("modal-window-4");

    //location.href = '#guestDelModal'
    guestDelModal.style.display = "block";
    // guestModalId.value = value;
    document.getElementById("guestModalDelBtn").value = value;

    // When the user clicks on <span> (x), close the modal
    if (span) {
        span.addEventListener("click", function () {
            guestDelModal.style.display = "none";
            let input = document.getElementById("guestPw");
            input.value = "";

        }, false);
    }

    // 모달 영역 밖 선택 시 창 닫기
    window.addEventListener("click", function () {
        if (event.target == guestDelModal) {
            guestDelModal.style.display = "none";
            let input = document.getElementById("guestPw");
            input.value = "";
            let fm = document.getElementById("guestDelForm");
            console.log("reset!")
            fm.reset();
            $('#guestPw').removeAttr("disabled");
        }
    }, false);
}

function guestModalDel() {

    let xhr = new XMLHttpRequest();
    let guestPw = document.getElementById("guestPw").value;
    let value = document.getElementById("guestModalDelBtn").value;
    let data = { 'pw': guestPw };
    data = JSON.stringify(data);
    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 201) {
            //console.log(xhr.responseText);
            alert("삭제 완료!");
            window.location.reload();
        } else if (500) {
            //console.error(xhr.responseText);
            alert("비밀번호를 확인하세요.");
            window.location.reload();
        } else {
            alert("삭제 오류!");
            window.location.reload();
        }
    };
    xhr.open("POST", "/work/delete/" + value);
    xhr.setRequestHeader("Content-Type", "application/json"); // 컨텐츠타입을 json으로
    xhr.send(data);
    console.log(guestPw.value);
}