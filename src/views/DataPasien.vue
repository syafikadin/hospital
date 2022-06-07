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

                </form>
                </b-modal>
            </div>

            <b-table-simple hover small caption-top responsive class="center">
                <b-thead>
                    <b-th>ID</b-th>
                    <b-th>Nama</b-th>
                    <b-th>Alamat</b-th>
                    <b-th>Jenis Kelamin</b-th>
                    <b-th>No.Telepon</b-th>
                    <b-th>Tempat Lahir</b-th>
                    <b-th>Tanggal Lahir</b-th>
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
                            {{ patient.name }}
                        </b-td>
                        <b-td>
                            {{ patient.address }}
                        </b-td>
                        <b-td>
                            {{ patient.gender }}
                        </b-td>
                        <b-td>
                            {{ patient.phone }}
                        </b-td>
                        <b-td>
                            {{ patient.placeOfBirth }}
                        </b-td>
                        <b-td>
                            {{ patient.dateOfBirth }}
                        </b-td>
                        <b-td>
                            {{ patient.disease }}
                        </b-td>
                        <b-td>
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
                name: '',
                address: ''
            },
            editForm: {
                name: '',
                address: ''
            },
            nameState: null,
            addressState: null,
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
                this.form.name = ''
                this.form.address = ''
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
            this.nameState = valid
            this.addressState = valid
            return valid
        },

        resetModal() {
            this.form.name = ''
            this.form.address = ''
            this.editForm.name = ''
            this.editForm.address = ''
            this.nameState = null
            this.addressState = null
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