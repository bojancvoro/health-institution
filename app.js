// ********MODEL********
// maintains data
// creates doctor and patient objects and adds them to data storage

const model = (function () {
    const appData = {
        doctors: [],
        patients: []
    }

    function handleAddItem(item) {
        if (item instanceof Doctor) {
            appData.doctors.push(item);
        } else if (item instanceof Patient) {
            appData.patients.push(item);
        }
    }

    function handleChooseDoctor(patientIndex, chosenDoctor) {
        appData.patients[patientIndex].chosenDoctor = chosenDoctor;
    }

    const Person = function (name) {
        this.name = name;
    }

    const Doctor = function (name, specialty) {
        Person.call(this, name);
        this.specialty = specialty;
    }

    const Patient = function (name, idNumber, cardNumber) {
        Person.call(this, name);
        this.idNumber = idNumber;
        this.cardNumber = cardNumber;
        this.chosenDoctor = null;
    }

    return {
        Doctor,
        Patient,
        handleAddItem,
        appData,
        handleChooseDoctor
    }

})();

// *******VIEW*******
// takes user inputs, displays data
// makes sure UI is updated when data is changed

const view = (function () {

    function handleTakeDoctorData(e) {
        e.preventDefault();
        const elements = e.target.elements;
        return {
            name: elements.doctorNameInput.value,
            specialty: elements.doctorSpecialtyInput.value
        }
    }

    function handleTakePatientData(e) {
        e.preventDefault();
        const elements = e.target.elements;
        return {
            name: elements.patientNameInput.value,
            id: elements.patientIdInput.value,
            cardNo: elements.patientCardNoInput.value
        }
    }

    function handleDisplayDoctors(doctors) {
        let output = "";
        doctors.forEach((doctor) => {
            output += `<li><p>${doctor.name}</p><p>${doctor.specialty}</p></li>`
        });
        document.getElementById("doctorList").innerHTML = output;
    }

    function handleDisplayPatients(patients, doctors) {
        document.getElementById("patientList").innerHTML = "";

        let doctorsListStr = "";
        doctors.forEach((doctor) => {
            doctorsListStr += `<option>${doctor.name}</option>`;
        });

        patients.forEach((patient, i) => {
            const patientsContainerDiv = document.createElement("div");
            patientsContainerDiv.id = i;

            const patientElement = document.createElement("div");
            patientElement.innerHTML = `<p>${patient.name}</p><p>${patient.idNumber}</p><p>${patient.cardNumber}</p>`;
            patientsContainerDiv.appendChild(patientElement);

            // create and append an element displaying data on chosen doctor
            const chosenDoctorElement = document.createElement("p");
            patientsContainerDiv.appendChild(chosenDoctorElement);
            
            // if doctor has been chosen, display the data, else display "no doctor chosen"
            //  and create and append select element with doctor options
            if (patient.chosenDoctor) {
                chosenDoctorElement.innerHTML = `<p>${patient.chosenDoctor}</p>`;
            } else {
                chosenDoctorElement.innerHTML = "(no doctor chosen)";
                const selectDoctorElement = document.createElement("select");
                const defaultOption = document.createElement("option");
                defaultOption.innerHTML = "Choose doctor";
                selectDoctorElement.add(defaultOption);
                selectDoctorElement.innerHTML += doctorsListStr;
                patientsContainerDiv.appendChild(selectDoctorElement);
            }
            document.getElementById("patientList").appendChild(patientsContainerDiv);
        });
    }

    function handleChooseDoctor(e) {
        e.preventDefault();
        return {
            chosenDoctor: e.target.value,
            patientIndex: e.target.parentNode.id
        }
    }

    return {
        handleTakeDoctorData,
        handleTakePatientData,
        handleDisplayDoctors,
        handleDisplayPatients,
        handleChooseDoctor
    }

})();

// *****CONTROLLER*****
// holds event handlers, receives methods from other two modules and runs them

const controller = (function (model, view) {

    const doctorForm = document.getElementById("doctorForm");
    const patientForm = document.getElementById("patientForm");
    const patientList = document.getElementById("patientList");

    function handleAddDoctor(e) {
        const doctorData = view.handleTakeDoctorData(e);
        const doctor = new model.Doctor(doctorData.name, doctorData.specialty);
        model.handleAddItem(doctor);
        view.handleDisplayDoctors(model.appData.doctors);
    }

    function handleAddPatient(e) {
        const patientData = view.handleTakePatientData(e);
        const patient = new model.Patient(patientData.name, patientData.id, patientData.cardNo);
        model.handleAddItem(patient);
        view.handleDisplayPatients(model.appData.patients, model.appData.doctors);
    }

    function handleChooseDoctor(e) {
        e.preventDefault();
        const data = view.handleChooseDoctor(e);
        model.handleChooseDoctor(data.patientIndex, data.chosenDoctor);
        view.handleDisplayPatients(model.appData.patients, model.appData.doctors)
    }

    doctorForm.addEventListener("submit", handleAddDoctor);
    patientForm.addEventListener("submit", handleAddPatient);
    patientList.addEventListener("change", handleChooseDoctor);

})(model, view);








