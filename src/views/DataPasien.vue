<template>
    <b-container>
        <div>
            <h1>Data Pasien</h1>
            <!-- <button @click="load()">Load</button><br><br> -->
            <div>
                <b-button v-b-modal.add-modal-prevent-closing variant="primary">Tambah Pasien</b-button><br><br>

                <!-- Modal Add Patient -->
                <b-modal
                id="add-modal-prevent-closing"
                ref="modal"
                title="Tambah Data Pasien Rawat Jalan"
                @show="resetModal"
                @hidden="resetModal"
                @ok="handleOkAddPatient"
                size="xl"
                >
                <form ref="form" @submit.stop.prevent="handleSubmitAddPatient()">
                    
                    <!-- Input NIK -->
                    <b-form-group
                    label="NIK"
                    label-for="nik-input"
                    invalid-feedback="NIK is required"
                    :state="nikState"
                    >
                    <b-form-input
                        id="nik-input"
                        v-model="form.nik"
                        :state="nikState"
                        required
                    ></b-form-input>
                    </b-form-group>
                    
                    <!-- Input Name -->
                    <b-form-group
                    label="Name"
                    label-for="name-input"
                    invalid-feedback="Name is required"
                    :state="nameState"
                    >
                    <b-form-input
                        id="name-input"
                        v-model="form.name"
                        :state="nameState"
                        required
                    ></b-form-input>
                    </b-form-group>

                    <!-- Input Address -->
                    <b-form-group
                    label="Address"
                    label-for="address-input"
                    invalid-feedback="Address is required"
                    :state="addressState"
                    >
                    <b-form-input
                        id="address-input"
                        v-model="form.address"
                        :state="addressState"
                        required
                    ></b-form-input>
                    </b-form-group>

                    <!-- Input Gender -->
                    <!-- <b-form-group
                    label="Gender"
                    label-for="gender-input"
                    invalid-feedback="Gender is required"
                    :state="genderState"
                    >
                    <div>
                        <b-form-select v-model="selected" class="mb-3">
                        <template #first>
                            <b-form-select-option :value="null" disabled>-- Please select an option --</b-form-select-option>
                        </template>

                        <b-form-select-option value="P">P</b-form-select-option>
                        <b-form-select-option value="L">L</b-form-select-option>
                        </b-form-select>
                    </div>
                    </b-form-group> -->

                    <!-- Input Radio Gender -->
                    <div>
                        <b-form-group
                        label="Jenis Kelamin"
                        >
                        <b-form-radio-group
                            id="btn-radios-2"
                            v-model="selected"
                            :options="options"
                            button-variant="outline-primary"
                            size="md"
                            name="radio-btn-outline"
                            buttons
                        ></b-form-radio-group>
                        </b-form-group>
                    </div>
                    
                </form>
                </b-modal>
            </div>

            <b-table-simple hover small caption-top responsive class="center">
                <b-thead>
                    <b-th>ID</b-th>
                    <b-th>NIK</b-th>
                    <b-th>Nama</b-th>
                    <b-th>Alamat</b-th>
                    <b-th>Jenis Kelamin</b-th>
                    <b-th>Jenis Penyakit</b-th>
                    <b-th>Jenis Penanganan</b-th>
                    <b-th>Aksi</b-th>
                </b-thead>
                <b-tbody>
                    <b-tr v-for="patient in patients" :key="patient.id">
                        <b-td>
                            {{ patient.id }}
                        </b-td>
                        <b-td>
                            {{ patient.nik }}
                        </b-td>
                        <b-td>
                            {{ patient.name }}
                        </b-td>
                        <b-td>
                            {{ patient.address }}
                        </b-td>
                        <b-td>
                            {{ patient.gender }}
                        </b-td>
                        <b-td v-if="patient.disease===''">
                            -
                        </b-td>
                        <b-td v-else>
                            {{ patient.disease }}
                        </b-td>
                        <b-td v-if="patient.handling===''">
                            -
                        </b-td>
                        <b-td v-else>
                            {{ patient.handling }}
                        </b-td>
                        <b-td>
                            <b-button @click="getIndex(patient.id)" v-b-modal.edit-modal-prevent-closing variant="success">Edit</b-button>
                        </b-td>
                    </b-tr>
                </b-tbody>
            </b-table-simple>
        </div>

        <!-- Modal Edit / Update Patient -->
        <div>
            <b-modal
                id="edit-modal-prevent-closing"
                ref="modal"
                title="Form Edit Pasien"
                @show="resetModal"
                @hidden="resetModal"
                @ok="handleOkEditPatient"
                size="xl"
            >
                <form ref="form" @submit.stop.prevent="handleSubmitEditPatient()">
                    <p>Index Number : {{ indexNumber }}</p>
                    <b-form-group
                    label="Name"
                    label-for="name-input"
                    invalid-feedback="Name is required"
                    :state="nameState"
                    >
                    <b-form-input
                        id="name-input"
                        v-model="editForm.name"
                        :state="nameState"
                        required
                    ></b-form-input>
                    </b-form-group>

                    <b-form-group
                    label="Address"
                    label-for="address-input"
                    invalid-feedback="Address is required"
                    :state="addressState"
                    >
                    <b-form-input
                        id="address-input"
                        v-model="editForm.address"
                        :state="addressState"
                        required
                    ></b-form-input>
                    </b-form-group>

                </form>
                <!-- <b-button class="w-100 mt-5" @click="deletePatient(indexNumber)" variant="danger">Delete</b-button> -->
                <template #modal-footer="{ ok }">
                    <b-button size="lg" variant="danger" @click="deletePatient(indexNumber)">
                        Delete
                    </b-button>
                    <b-button size="lg" variant="success" @click="ok()">
                        Simpan
                    </b-button>
                </template>
                </b-modal>
        </div>

    </b-container>
</template>

<script>
import axios from 'axios'

export default {
    name: "DataPasienPage",
    data() {
        return {
            patients: [],
            editMode: false,
            indexNumber: '',
            form : {
                nik: '',
                name: '',
                address: '',
                gender: '',
                phone: '',
                placeOfBirth: '',
                dateOfBirth: '',
                disease: '',
                handling: ''
            },
            editForm: {
                name: '',
                address: ''
            },
            nikState: null,
            nameState: null,
            addressState: null,
            genderState: null,
            selected: 'laki-laki',
            options: [
                { text: 'Laki-laki', value: 'laki-laki' },
                { text: 'Perempuan', value: 'perempuan' },
            ]
        }
    },

    async mounted() {
        this.load()
    },

    methods: {
        async load() {
            const response = await axios.get(`http://localhost:3000/patients`)
            this.patients = response.data
        },

        getIndex(indexId) {
            this.indexNumber = indexId
        },

        async addPatient() {
            try {
                await axios.post(`http://localhost:3000/patients`, this.form)
                this.load()
            } catch (error) {
                console.log(error)
            }
        },

        async deletePatient(indexId) {
            if (confirm('Apakah Anda Akan Menghapus Data Ini?') == true) {
                try {
                    await axios.delete(`http://localhost:3000/patients/` + indexId)
                    this.load()
                } catch (error) {
                    console.log(error)
                }
            }
            this.$nextTick(() => {
                this.$bvModal.hide('edit-modal-prevent-closing')
            })
        },

        async updatePatient() {
            try {
                await axios.put(`http://localhost:3000/patients/` + this.indexNumber, {
                    name: this.editForm.name,
                    address: this.editForm.address
                })
                this.load()
                this.editForm.name = ''
                this.editForm.address = ''
            } catch (error) {
                console.log(error)
            }
        },

        checkFormValidity() {
            const valid = this.$refs.form.checkValidity()
            this.nikState = valid
            this.nameState = valid
            this.addressState = valid
            this.genderState = valid
            return valid
        },

        resetModal() {
            this.form.nik = ''
            this.form.name = ''
            this.form.address = ''
            this.form.gender = ''
            this.editForm.name = ''
            this.editForm.address = ''
            this.nikState = null
            this.nameState = null
            this.addressState = null
            this.genderState = null
        },

        handleOkAddPatient(bvModalEvent) {
            // Prevent modal from closing
            bvModalEvent.preventDefault()
            // Trigger submit handler
            this.handleSubmitAddPatient()
        },

        handleOkEditPatient(bvModalEvent) {
            // Prevent modal from closing
            bvModalEvent.preventDefault()
            // Trigger submit handler
            this.handleSubmitEditPatient()
        },

        handleSubmitAddPatient() {
            // Exit when the form isn't valid
            if (!this.checkFormValidity()) {
                return
            }
            this.addPatient()
            // Hide the modal manually
            this.$nextTick(() => {
                this.$bvModal.hide('add-modal-prevent-closing')
            })
        },

        handleSubmitEditPatient() {
            // Exit when the form isn't valid
            if (!this.checkFormValidity()) {
                return
            }
            this.updatePatient()
            this.indexNumber = ''
            // Hide the modal manually
            this.$nextTick(() => {
                this.$bvModal.hide('edit-modal-prevent-closing')
            })
        }

    }
}
</script>

<style>
 .center{
     /* margin-left: auto;
     margin-right: auto; */
 }
</style>