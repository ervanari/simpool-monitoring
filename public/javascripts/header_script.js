/** @format */

const copyText = (value) => {
  navigator.clipboard.writeText(value);
};

const modalShow = (modalId, url = null) => {
  const element = document.getElementById(modalId);
  if (url !== null) {
    element
      .querySelector(".modal-dialog > .modal-content > .modal-footer > a")
      .setAttribute("href", url);
  }
  const modals = new bootstrap.Modal(element, {});
  modals.show();
};

const changeRestart = (status, id, key) => {
  const id_device = document.getElementById("_idrestart");
  const status_dev = document.getElementById("status_restart");
  let typeText = document.getElementById("typeRamdom");

  id_device.value = id;
  status_dev.value = status;
  typeText.innerHTML = key;
};

const renew_pulsa = (port) => {
  let mode = document.getElementById("mode");
  let ports = document.getElementById("ports");

  mode.value = "single";
  ports.innerHTML = port;
};

var codesEl;
const onSearch = (e) => {
  // console.log(e);
  let elData = document.getElementById("elSearch");
  elData.value;
};

// function search(ev) {
//   var key = ev.target.value;
//   codesEl.innerText = null;
//   onSearch(
//     jsonData.filter((data) => {
//       var regex = new RegExp(key, "i");
//       return data.name.match(regex) || data.code.match(regex);
//     })
//   );
// }

// window.onload = function () {
//   codesEl = document.getElementById("codes");
//   onSearch(jsonData);
// };
