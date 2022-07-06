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
  let elData = document.getElementById("elSearch");
  let elSortCard = document.getElementById("btnSortCard");
  elData.value = e.value;

  if (elData.value != "null") {
    elSortCard.style.display = "block";
  } else {
    elSortCard.style.display = "none";
  }

  // $.ajax({
  //   type: "post",
  //   url: "/search_data",
  //   data: {
  //     eldata: e.value,
  //   },
  //   success: function (data) {
  //     window.location.href = "/search_data";
  //   },
  // });
};

const cek_pulsa = (port) => {
  localStorage.setItem("port", port);
  const socket = io("https://qz-pulsa.intama.online");

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

const actServices = (datakey, datastatus) => {
  let serviceKey = document.getElementById("key_service");
  serviceKey.value = datakey;
  onchangeOption(datakey, datastatus);
};

const onchangeOption = (datakey, datastatus) => {
  if (datastatus == "online") {
    document.getElementById("startservice").style.display = "none";
  }
};

const switchdisplay = (param) => {
  if (document.getElementById("switch").checked) {
    document.getElementById("grid").style.display = "block";
    document.getElementById("list").style.display = "none";
  } else {
    document.getElementById("grid").style.display = "none";
    document.getElementById("list").style.display = "block";
  }
};

const smsMasuk = (data) => {
  let bSms = document.getElementById("bodysms");
  bSms.innerHTML = data;
};

const getPulsa = (pulsa) => {
  // console.log(document.getElementById("inlineFormCustomSelect").value);
};

window.addEventListener("DOMContentLoaded", (event) => {
  let list = document.getElementById("list");
  if (list != null) {
    document.getElementById("list").style.display = "none";
  }

  const socket = io("https://qz-pulsa.intama.online");
  socket.on("connect", function () {
    console.info("Socket connect");
  });

  socket.on(
    "payment_completed::0f289dc7-c77a-48bc-abbc-82b389909c73",
    function (data) {
      if (data != "") {
        window.location.href = "/dashboard";
      }
    }
  );

  socket.on("pulsa_in::0f289dc7-c77a-48bc-abbc-82b389909c73", function (data) {
    if (data != "") {
      window.location.href = "/dashboard";
    }
  });

  socket.on(
    "device_update::0f289dc7-c77a-48bc-abbc-82b389909c73",
    function (data) {
      if (data != "") {
        window.location.href = "/dashboard";
      }
    }
  );

  socket.on(
    "ussd_dial_message::0f289dc7-c77a-48bc-abbc-82b389909c73",
    function (data) {
      if (data != "") {
        window.location.href = "/dashboard";
      }
    }
  );

  cek_pulsa();
});
