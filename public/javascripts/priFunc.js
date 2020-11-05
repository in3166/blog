//private
window.onload = function () {
    // 현재 페이지, 게시글 표시
    let currentPageNumber = document.getElementById("currentPageNumber").value;
    let listClass = "cp" + currentPageNumber;
    let currentList = document.getElementById(listClass);
    currentList.classList.add('current');
    //let boardNum = document.getElementById("priPostSubmit").value;
    let currentBoard = document.getElementById(document.getElementById("priPostSubmit").value);
    currentBoard.classList.add('current');



    //게시글 작성 모달 열기
    const priPostBtn = document.getElementById("priPostBtn");
    if (priPostBtn) {
        priPostBtn.addEventListener("click", postModalOpen, false);
    }

    //게시글 등록
    const priPostSubmit = document.getElementById("priPostSubmit");
    if (priPostSubmit) {
        priPostSubmit.addEventListener("click", postSubmit, false);
    }

    //댓글 등록
    const commentSubmitBtn = document.getElementById("commentSubmit");
    if (commentSubmitBtn) {
        commentSubmitBtn.addEventListener("click", commentSubmit, false);
    }

    //댓글 삭제 비밀번호 입력창 열기
    const commentDel = document.getElementsByName("commentDel");
    if (commentDel) {
        for (let i = 0; i < commentDel.length; i++) {
            commentDel[i].addEventListener("click", commentPwModalOpen, false);
        }
    }

    //댓글 삭제
    let commentModalDelBtn = document.getElementById("commentModalDelBtn");
    if (commentModalDelBtn) {
        commentModalDelBtn.addEventListener("click", commentModalDel, false);
    }

    //게시글 삭제 비밀번호 입력창 열기
    const postDelBtn = document.getElementById("postDelBtn");
    if (postDelBtn) {
        postDelBtn.addEventListener("click", commentPwModalOpen, false);
    }

    // //게시글 삭제
    // let commentModalDelBtn2 = document.getElementById("");
    // if (commentModalDelBtn2) {
    //     commentModalDelBtn2.addEventListener("click", postModalDel, false);
    // }

    //페이지네이션 번호 클릭 AJAX 보류
    // let listNumBtn = document.getElementsByName("listNum");
    // //let listNumBtn = document.getElementsByClassName("listNum1");
    // if (listNumBtn) {
    //     for (let i = 0; i < listNumBtn.length; i++) {
    //         listNumBtn[i].addEventListener("click", listNumPagination, false);
    //     }
    // }

}

// function listNumPagination() {
//     console.log("come")
//     let xhr = new XMLHttpRequest();

//     let value = this.value;
//     console.log(value);
//     let url = document.getElementById("priPostSubmit").value;
//     console.log(url);

//     let data = { 'value': value };
//     data = JSON.stringify(data);
//     console.log(data);

//     xhr.onload = function () {
//         if (xhr.status === 200 || xhr.status === 201) {
//             //console.log(xhr.responseText);
//         } else if (500) {
//             //console.error(xhr.responseText);
//             //window.location.reload();
//         } else {
//             // window.location.reload();
//         }
//     };
//     xhr.open("post", "/private/board/" + url + "/list", true);
//     xhr.setRequestHeader("Content-Type", "application/json");  // 컨텐츠타입을 json으로
//     xhr.send(data);
// }

//댓글 삭제 비밀번호 입력창
function commentPwModalOpen() {
    let value = this.value; // 삭제 아이콘의 값 가져옴
    console.log(value);
    $(document).off('focusin.modal'); //삭제 모달 오픈 시 텍스트 선택 불가 해결 - 모달에 포커스가 있어서

    let span = document.getElementById("commentClose");

    //비밀번호 입력창 오픈
    let commentDelModal = document.getElementById("commentDelModal");
    commentDelModal.style.display = "block";

    document.getElementById("commentModalDelBtn").value = value;

    // When the user clicks on <span> (x), close the modal
    if (span) {
        span.addEventListener("click", function () {
            commentDelModal.style.display = "none";
            let input = document.getElementById("commentDelPw");
            input.value = "";

        }, false);
    }

    // 모달 영역 밖 선택 시 창 닫기
    window.addEventListener("click", function () {
        if (event.target == commentDelModal) {
            commentDelModal.style.display = "none";

            let fm = document.getElementById("commentDelForm");
            //console.log("reset!")
            fm.reset();
            $('#commentPw').removeAttr("disabled");
        }
    }, false);
}

// 댓글 삭제
function commentModalDel() {
    let xhr = new XMLHttpRequest();
    let commentDelPw = document.getElementById("commentDelPw").value;
    let value = document.getElementById("commentModalDelBtn").value;
    let commentDelModal = document.getElementById("commentDelModal");

    let div = value; //삭제할 댓글 div
    let commentDiv = document.getElementById(div); //삭제할 댓글 div
    let data = { 'pw': commentDelPw };
    data = JSON.stringify(data);
    //console.log("비밀번호: " + data);

    xhr.onload = function () {
        let input = document.getElementById("commentDelPw");
        input.value = "";
        if (xhr.status === 200 || xhr.status === 201) {
            //console.log(xhr.responseText);
            alert("삭제 완료!");
            if (commentDiv)
                commentDiv.parentNode.removeChild(commentDiv);
            commentDelModal.style.display = "none";
            if (value.indexOf("board") !== -1) // 게시글 삭제일 경우 새로고침
                window.location.href = '/private';
            //window.location.reload();
        } else if (500) {
            alert("비밀번호를 확인하세요.");
        } else {
            alert("삭제 오류!");
            window.location.reload();
        }
    };
    xhr.open("POST", "/private/delete/" + value);
    xhr.setRequestHeader("Content-Type", "application/json"); // 컨텐츠타입을 json으로
    xhr.send(data);
    //console.log(guestPw.value);
}

function postModalOpen() {
    $('body').css("overflow", "hidden");
    let postModal = document.getElementById("postModal");
    // let guestModalId = document.getElementById("guestModalId");
    let span = document.getElementById("postClose");

    // let postModalBtn = document.getElementById("postModalBtn");
    //let modal = document.getElementById("modal-window-4");

    //게시글 작성 모달 오픈
    //location.href = '#guestDelModal'
    postModal.style.display = "block";
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

//댓글 전송
function commentSubmit() {

    let xhr = new XMLHttpRequest();

    let name = document.getElementById("commentName").value;
    let content = document.getElementById("commentContent").value;
    let pw = document.getElementById("commentPw").value;
    let num = this.value;
    console.log(num);

    let data = { name: name, content: content, pw: pw };
    data = JSON.stringify(data);
    console.log(data);

    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 201) {
            //console.log(xhr.responseText);
            alert("댓글 작성 완료!");

        } else {
            alert("댓글 작성 오류!");
            window.location.reload();
        }
    }

    xhr.open('post', '/private/write/' + num);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}

// $("a").click(function () {
//     $(".current").removeClass("current");
//     //return false;
// });

//게시글 작성 버튼들
CKEDITOR.replace('p_content'
    , {
        height: 450
    });
