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

    //게시글 작성 모달 열기
    const workPostBtn = document.getElementById("workPostBtn");
    if (workPostBtn) {
        workPostBtn.addEventListener("click", workModalOpen, false);
    }

    //게시글 등록
    const priPostSubmit = document.getElementById("priPostSubmit");
    if (priPostSubmit) {
        priPostSubmit.addEventListener("click", postSubmit, false);
    }

    GitHubCalendar(".calendar", "in3166", { responsive: true, tooltips: false, global_stats: false }).then(function () {
        // delete the space underneath the module bar which is caused by minheight 
        document.getElementsByClassName('calendar')[0].style.minHeight = "100px";
        // hide more and less legen below the contribution graph
        document.getElementsByClassName('contrib-legend')[0].style.display = "none";
    });

}


//게시글 작성 모달 오픈
function workModalOpen() {
    $('body').css("overflow", "hidden");

    let postModal = document.getElementById("postModal");
    // let guestModalId = document.getElementById("guestModalId");
    let span = document.getElementById("postClose");
    // let postModalBtn = document.getElementById("postModalBtn");
    //let modal = document.getElementById("modal-window-4");

    //게시글 작성 모달 오픈
    //location.href = '#guestDelModal'
    postModal.style.display = "block";
    //    document.getElementById("postTitle").focus();
    // guestModalId.value = value;

    // When the user clicks on <span> (x), close the modal
    if (span) {
        span.addEventListener("click", function () {
            postModal.style.display = "none";
            $('body').css("overflow", "scroll");
        }, false);
    }

    // 모달 영역 밖 선택 시 창 닫기
    window.addEventListener("click", function () {
        if (event.target == postModal) {
            postModal.style.display = "none";
            $('body').css("overflow", "scroll");
        }
    }, false);
}


//게시글 전송
function postSubmit() {

    let xhr = new XMLHttpRequest();
    let title = document.getElementById("postTitle").value;
    let content = CKEDITOR.instances.p_content.getData();
    let boardNum = this.value;
    let postPw = document.getElementById("postPw").value;

    let data = { title: title, content: content, pw: postPw };
    data = JSON.stringify(data);
    console.log(data);

    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 201) {
            //console.log(xhr.responseText);
            alert("게시글 작성 완료!");
            let postModal = document.getElementById("postModal");
            postModal.style.display = "none";
            $('body').css("overflow", "scroll");
        } else if (500) {
            //console.error(xhr.responseText);
            console.log("오잉?")
            alert("비밀번호를 확인하세요.");
        } else {
            alert("게시글 작성 오류!");
        }
    }

    xhr.open('post', '/private/write/' + boardNum);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
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
    xhr.open("delete", "/work/guest/" + value);
    xhr.setRequestHeader("Content-Type", "application/json"); // 컨텐츠타입을 json으로
    xhr.send(data);
}