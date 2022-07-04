const url = new URL(location.href);
function getFeedList() {
  if (!feedObj) {
    return;
  }
  const urlParams = url.searchParams;

  feedObj.showLoading();
  // const iuser = location.search.split('?iuser=');
  const param = {
    page: feedObj.currentPage++,
    iuser: urlParams.get('iuser'),
  };
  fetch('/user/feed' + encodeQueryString(param) + location.search)
    .then((res) => res.json())
    .then((list) => {
      feedObj.makeFeedList(list);
    })
    .catch((e) => {
      console.error(e);
      feedObj.hideLoading();
    });
}
getFeedList();

(function () {
  const gData = document.querySelector('#gData');

  const btnFollow = document.querySelector('#btnFollow');
  if (btnFollow) {
    btnFollow.addEventListener('click', function () {
      const param = {
        toiuser: parseInt(gData.dataset.toiuser),
      };
      console.log(param);
      const follow = btnFollow.dataset.follow;
      console.log('follow : ' + follow);
      const followUrl = '/user/follow';
      switch (follow) {
        case '1': //팔로우 취소
          fetch(followUrl + encodeQueryString(param), { method: 'DELETE' })
            .then((res) => res.json())
            .then((res) => {
              if (res.result) {
                btnFollow.dataset.follow = '0';
                btnFollow.classList.remove('btn-outline-secondary');
                btnFollow.classList.add('btn-primary');
                if (btnFollow.dataset.youme === '1') {
                  btnFollow.innerText = '맞팔로우 하기';
                } else {
                  btnFollow.innerText = '팔로우';
                }
              }
            });
          break;
        case '0': //팔로우 등록
          fetch(followUrl, {
            method: 'POST',
            body: JSON.stringify(param),
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.result) {
                btnFollow.dataset.follow = '1';
                btnFollow.classList.remove('btn-primary');
                btnFollow.classList.add('btn-outline-secondary');
                btnFollow.innerText = '팔로우 취소';
              }
            });
          break;
      }
    });
  }
})();

// (function () {
//   const btnFollow = document.querySelector('#btnFollow');
//   btnFollow.addEventListener('click', () => {
//     if (btnFollow.innerText === '팔로우' || btnFollow.innerText === '맞팔로우 하기') {
//       fetch(`http://localhost/user/follow${window.location.search}`, {
//         method: 'POST',
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           btnFollow.setAttribute('data-follow', 1);
//           btnFollow.className = 'btn btn-outline-secondary';
//           btnFollow.innerText = '팔로우 취소';
//         });
//     } else if (btnFollow.innerText === '팔로우 취소') {
//       fetch(`http://localhost/user/follow${window.location.search}`, {
//         method: 'DELETE',
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           btnFollow.setAttribute('data-follow', 0);
//           btnFollow.className = 'btn btn-primary';
//           if (Number(btnFollow.dataset.youme) === 1) {
//             btnFollow.innerText = '맞팔로우 하기';
//           } else {
//             btnFollow.innerText = '팔로우';
//           }
//         });
//     }
//   });
// })();
