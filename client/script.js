const IP_ADDRESS = 'localhost';

document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.getElementById("registration-form");
  const searchTransmileni = document.getElementById("transmilenio-form");
  const removalForm = document.getElementById("removal-form");

  function fetchCarsList() {
    console.log('3');
    fetch(`http://${IP_ADDRESS}:3000/transmilenio`)
      .then((response) => response.json())
      .then((data) => {
        const carsTableBody = document.getElementById("transmilenio-table-body");
        carsTableBody.innerHTML = "";
        data.forEach((transmilenio) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                <td>${transmilenio.license_plate}</td>
                <td>${transmilenio.timestamp}</td>
                <td>${transmilenio.editing}</td>
            `;
          carsTableBody.appendChild(row);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while fetching the car list. Please try again.");
      });
  }
  // function fetchCarsList() {
    // fetch(`http://${IP_ADDRESS}:3000/transmilenio`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     const carsTableBody = document.getElementById("transmilenio-table-body");
    //     carsTableBody.innerHTML = "";
    //     data.forEach((transmilenio) => {
    //       const row = document.createElement("tr");
    //       row.innerHTML = `
    //             <td>${transmilenio.license_plate}</td>
    //             <td>${transmilenio.timestamp}</td>
    //             <td>${transmilenio.editing}</td>
    //         `;
    //       carsTableBody.appendChild(row);
    //     });
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //     alert("An error occurred while fetching the car list. Please try again.");
    //   });
  // }

  fetchCarsList();

  searchTransmileni.addEventListener("submit", function (event) {
    event.preventDefault();

    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    console.log(startDate, endDate);

    if (!startDate || !endDate) {
        alert("Por favor, ingrese ambas fechas.");
        return;
    }

    const url = new URL(`http://${IP_ADDRESS}:3000/citas`);
    url.searchParams.append('fechaInicio', startDate);
    url.searchParams.append('fechaFin', endDate);

    fetch(url)
      .then((response) => response.json())
      .then((citas) => {
        const searchTransmi = document.getElementById("search");
        searchTransmi.innerHTML = "";
        if (citas) {
          citas.forEach((data) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                  <td>${data.id}</td>
                  <td>${data.cc}</td>
                  <td>${data.date}</td>
                  <td>des</td>
                  <td>${data.cancelada}</td>
              `;
            searchTransmi.appendChild(row);
          });
        } else {
          searchTransmileni.reset();
          alert("Transmilenio no encontrado");
        }
      })
      .catch((error) => {
        const searchTransmi = document.getElementById("transmilenio-search");
        searchTransmi.innerHTML = "";
        alert("Transmilenio no encontrado");
      });
  });


  registrationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(registrationForm);
    const authorisationFile = document.getElementById("authorisation").files[0];
    const date = document.getElementById("dateInput").value;
    if (authorisationFile) {
      formData.append("authorisation", authorisationFile);
    }
    const requestData = {
      cc: formData.get("cc"),
      date: date,
      authorisation: authorisationFile ? authorisationFile : null,
    };
    console.log(requestData);

  
    fetch(`http://${IP_ADDRESS}:3000/citas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.text())
      .then((data) => {
        if(data.includes('cita updated successfully')){
        alert(data);}
        registrationForm.reset();
        // fetchCarsList();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  });

  removalForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(removalForm);
    const id = formData.get("license-plate");

    fetch(`http://${IP_ADDRESS}:3000/citas/${id}/cancelar`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((response) => response.text())
      .then((data) => {
        alert(data);
        removalForm.reset();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while removing the car. Please try again.");
      });
  });
});
