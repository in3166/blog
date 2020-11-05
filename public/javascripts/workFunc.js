window.onload = function () {
    const guestDeleteConfirm = document.getElementById("guestDeleteConfirm");
    if (guestDeleteConfirm) {
        if (guestDeleteConfirm.value === "true")
            alert("비밀번호를 확인하세요.??");
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

//방명록 modal open
function guestPwModalOpen() {
    let value = this.value;
    console.log("1" + value);
    $(document).off('focusin.modal'); //삭제 모달 오픈 시 텍스트 선택 불가 해결 - 모달에 포커스가 있어서
    // 댓글 삭제 모달 열기
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
            fm.reset();
            $('#guestPw').removeAttr("disabled");
        }
    }, false);
}

// 방명록 삭제
function guestModalDel() {

    let xhr = new XMLHttpRequest();
    let guestPw = document.getElementById("guestPw").value;
    let value = document.getElementById("guestModalDelBtn").value;
    let guestDelModal = document.getElementById("guestDelModal");

    let data = { 'pw': guestPw };
    data = JSON.stringify(data);

    let div = "guest" + value;
    let div0 = "guest0" + value;
    let guestDiv = document.getElementById(div); //삭제할 방명록 div
    let guestDiv0 = document.getElementById(div0); //삭제할 방명록 div
    console.log("div: " + div);
    console.log("Gdiv: " + guestDiv);

    var parent = document.querySelector('#dataTable tbody') // 전체보기에서 행 삭제
    var parent2 = document.querySelector('#dataTable0 tbody') // 메인화면에서 행 삭제

    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 201) {
            //console.log(xhr.responseText);
            alert("삭제 완료!");
            if (guestDiv) {
                parent.removeChild(guestDiv);
            }
            if (guestDiv0) {
                parent2.removeChild(guestDiv0);
            }
            guestDelModal.style.display = "none";
            let input = document.getElementById("guestPw");
            input.value = "";
        } else if (500) {
            alert("비밀번호를 확인하세요.");
            let input = document.getElementById("guestPw");
            input.value = "";
        } else {
            alert("삭제 오류!");
            window.location.reload();
        }
    };
    xhr.open("delete", "/work/delete/" + value);
    xhr.setRequestHeader("Content-Type", "application/json"); // 컨텐츠타입을 json으로
    xhr.send(data);
}