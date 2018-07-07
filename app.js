// ********MODEL********
// maintains data
// creates doctor and patient objects and adds them to data storage (addData object)

const model = (function () {
    const appData = {
        doctors: [{name: "dummy doctor", specialty: "dummy spec",}, { name: "jon", specialty: "smith"}],
        patients: []
    }

    function handleAddItem(item) {
        if(item instanceof Doctor) {
            appData.doctors.push(item);
        } else if(item instanceof Patient) {
            appData.patients.push(item);
        } 
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
        appData
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

        let patientsContainerDiv = document.createElement("div");

        let doctorsListStr = "";
        doctors.forEach((doctor) => {
            doctorsListStr += `<option>${doctor.name}</option>`;
        });

          
        patients.forEach((patient, i) => {

            // create element that holds both patients detail and select element
            // replace the element oustide foreach doing same thing
            // give it an id

            // in function that handles adding choosen doctor:
            // get value from select (doctors name, probably need a func in controller to get it)
            // form click event get index number of the patient
            // add chosen doctor name to the patient object coresponding to the clicked patient element 


            let patientElement = document.createElement("div");
            let patientStr = `<p>${patient.name}</p><p>${patient.idNumber}</p><p>${patient.cardNumber}</p>`;
            patientElement.innerHTML = patientStr;

            let doctorOptions = document.createElement("div");
            if(patient.chosenDoctor) {
                doctorOptions.innerHTML = `<p>${patient.chosenDoctor}</p>`;
            } else {
                let doctorsElement = document.createElement("select");
                doctorsElement.innerHTML = doctorsListStr;

                doctorOptions.appendChild(doctorsElement);
            }
            patientsContainerDiv.appendChild(patientElement);
            patientsContainerDiv.appendChild(doctorOptions);
        });
        
        document.getElementById("patientList").appendChild(patientsContainerDiv);
    }

    return {
        handleTakeDoctorData,
        handleTakePatientData,
        handleDisplayDoctors,
        handleDisplayPatients
    }

})();

// *****CONTROLLER*****
// holds event handlers, receives methods from other two modules and runs them
// "brings the other two modules together"

const controller = (function (model, view) {

    // const doctorForm = document.getElementById("doctorForm");
    // const patientForm = document.getElementById("patientForm");

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

    doctorForm.addEventListener("submit", handleAddDoctor);
    patientForm.addEventListener("submit", handleAddPatient);

    view.handleDisplayDoctors(model.appData.doctors);

})(model, view);








