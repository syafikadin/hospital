<template>
    <div>
        <div>
            <h1>Data Pasien</h1>
            <!-- <button @click="load()">Load</button><br><br> -->
            <button @click="changeAddMode()">Tambah Pasien</button><br><br>
            <table border="1" class="center">
                <th>ID</th>
                <th>Nama</th>
                <th>Alamat</th>
                <th colspan="2">Aksi</th>
                <tr v-for="patient in patients" :key="patient.id">
                    <td width="50px">
                        {{ patient.id }}
                    </td>
                    <td width="100px">
                        {{ patient.name }}
                    </td>
                    <td width="200px">
                        {{ patient.address }}
                    </td>
                    <td width="70px">
                        <button @click="changeEditMode(patient.id)">Edit</button>
                    </td>
                    <td width="70px">
                        <button @click="deletePatient(patient.id)">Delete</button>
                    </td>
                </tr>
            </table>
        </div>
        <div v-if="this.addMode">
            <h1>Tambah Pasien</h1>
            <form @submit.prevent="addPatient()">
                <table border="1" class="center">
                    <tr>
                        <input type="text" placeholder="Nama Pasien" v-model="form.name">
                    </tr>
                    <tr>
                        <input type="text" placeholder="Alamat Pasien" v-model="form.address">
                    </tr>
                    <button type="submit">Submit</button>
                    <button @click="cancelAddMode()">Cancel</button>
                </table>
            </form>
        </div>
        <div v-if="this.editMode">
            <h1>Edit Pasien</h1>
            <table border="1" class="center">
                <tr>
                    <input type="text" placeholder="Edit Nama Pasien" v-model="editForm.name">
                </tr>
                <tr>
                    <input type="text" placeholder="Edit Alamat Pasien" v-model="editForm.address">
                </tr>
                <button @click="updatePatient()">Submit</button>
                <button @click="cancelEditMode()">Cancel</button>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: "DataPasienPage",

    data() {
        return {
            patients: [],
            addMode: false,
            editMode: false,
            indexNumber: '',
            form : {
                name: '',
                address: ''
            },
            editForm: {
                name: '',
                address: ''
            }
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

        changeAddMode() {
            if(this.editMode === true) {
                this.editMode = false
            }
            this.addMode = true
        },

        changeEditMode(indexId) {
            if (this.addMode === true) {
                this.addMode = false
            }
            this.editMode = true
            this.indexNumber = indexId
        },

        cancelAddMode() {
            this.addMode = false
        },

        cancelEditMode() {
            this.editMode = false
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
            confirm('Apakah Anda Akan Menghapus Data Ini?')
            try {
                await axios.delete(`http://localhost:3000/patients/` + indexId)
                this.load()
            } catch (error) {
                console.log(error)
            }
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

    }
}
</script>

<style>
 .center{
     /* margin-left: auto;
     margin-right: auto; */
 }
</style>