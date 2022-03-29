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
  let ports = document.getElementById("port");

  mode.value = "single";
  ports.value = port;
};

const onSearch = (e) => {
  // console.log(e.target.value);
  let elData = document.getElementById("elSearch");
  elData.value = e.target.value;
};

const cek_pulsa = (port) => {
  localStorage.setItem("port", port);
  let socket = io("https://qz-pulsa.intama.online");

  let type = document.getElementById("type");
  let ports = document.getElementById("port_pulsa");
  type != null ? (type.value = "single") : (type.value = "");
  ports.innerHTML = port;

  if (port != undefined) {
    socket.on("receive_balance_" + port, function (data) {
      // console.log("receive_balance_", data);
      if (data != "") {
        window.location.href = "/dashboard";
      }
    });
  }
};

const actServices = () => {
  let type = document.getElementById("run");
  console.log(type.value);
  type;
};

window.addEventListener("DOMContentLoaded", (event) => {
  var socket = io("https://qz-pulsa.intama.online");
  socket.on("connect", function () {
    console.info("Socket connect");
  });
  socket.on(
    "payment_completed::0f289dc7-c77a-48bc-abbc-82b389909c73",
    function (data) {
      // console.log("payment_completed", data)
      if (data != "") {
        window.location.href = "/dashboard";
      }
    }
  );
  socket.on("pulsa_in::0f289dc7-c77a-48bc-abbc-82b389909c73", function (data) {
    // console.log("pulsa_in", data)
    if (data != "") {
      window.location.href = "/dashboard";
    }
  });
  socket.on(
    "device_update::0f289dc7-c77a-48bc-abbc-82b389909c73",
    function (data) {
      // console.log("device_update", data)
      if (data != "") {
        window.location.href = "/dashboard";
      }
    }
  );
  socket.on(
    "ussd_dial_message::0f289dc7-c77a-48bc-abbc-82b389909c73",
    function (data) {
      // console.log("ussd_dial_message", data)
      if (data != "") {
        window.location.href = "/dashboard";
      }
    }
  );

  cek_pulsa();
});
