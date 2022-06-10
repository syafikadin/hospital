<template>
  <b-container>
    <b-row>

      <h1>Data Pasien</h1>
      <b-col lg="6" class="my-1">
        <b-form-group
          label="Filter"
          label-for="filter-input"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              id="filter-input"
              v-model="filter"
              type="search"
              placeholder="Type to Search"
            ></b-form-input>

            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col lg="6" sm="5" md="6" class="my-1">
        <b-button
        v-b-modal.add-modal-prevent-closing
        variant="primary"
        >
        Tambah Pasien
        </b-button>

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

              <!-- Input Radio Gender -->
              <b-form-group
              label="Jenis Kelamin"
              label-for="gender-input"
              invalid-feedback="Jenis Kelamin is required"
              :state="genderState"
              >
              <b-form-radio-group
                  id="btn-radios-2"
                  v-model="form.gender"
                  :options="options"
                  button-variant="outline-primary"
                  size="md"
                  name="radio-btn-outline"
                  buttons
                  required
              ></b-form-radio-group>
              </b-form-group>

              <!-- Input Phone -->
              <b-form-group
              label="Phone"
              label-for="phone-input"
              invalid-feedback="Phone is required"
              :state="phoneState"
              >
              <b-form-input
                  id="phone-input"
                  v-model="form.phone"
                  :state="phoneState"
                  required
              ></b-form-input>
              </b-form-group>

              <!-- Input Place of Birth -->
              <b-form-group
              label="Place of Birth"
              label-for="placeOfBirth-input"
              invalid-feedback="Place of Birth is required"
              :state="placeOfBirthState"
              >
              <b-form-input
                  id="placeOfBirth-input"
                  v-model="form.placeOfBirth"
                  :state="placeOfBirthState"
                  required
              ></b-form-input>
              </b-form-group>
  
              <!-- Input Date of Birth -->
              <b-form-group
              label="Date of Birth"
              label-for="dateOfBirth-input"
              invalid-feedback="Date of Birth is required"
              :state="dateOfBirthState"
              >
              <b-form-datepicker
                id="dateOfBirth-datepicker"
                v-model="form.dateOfBirth"
                :state="dateOfBirthState"
                required
              ></b-form-datepicker>
              </b-form-group>

          </form>
          </b-modal>
      </b-col>


    </b-row>

    <!-- Main table element -->
    <b-table
      :items="patients"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filter-included-fields="filterOn"
      stacked="md"
      show-empty
      small
      @filtered="onFiltered"
      class="text-center"
    >

      <template #cell(disease)="row">
        <p v-if="row.item.disease === ''">--</p>
        <p v-else>{{ row.item.disease }}</p>
      </template>

      <template #cell(handling)="row">
        <p v-if="row.item.handling === ''">--</p>
        <p v-else>{{ row.item.handling }}</p>
      </template>

      <template #cell(actions)="row">
        <b-button 
        v-b-modal.detail-modal-prevent-closing 
        size="sm" 
        @click="getIndex(row.index)" 
        class="mr-1">
          Detail
        </b-button>
      </template>

    </b-table>

    <b-modal
    id="detail-modal-prevent-closing"
    ref="modal"
    title="Detail Data Pasien Rawat Jalan"
    @show="resetModal"
    @hidden="resetModal"
    @ok="handleOkAddPatient"
    size="xl"
    >

    <!-- Detail View Mode -->
    <div v-if="editMode === false">
      <form ref="form" @submit.stop.prevent="handleSubmitAddPatient()">
      <!-- Input NIK -->
      <b-form-group
      label="NIK"
      label-for="nik-input"
      invalid-feedback="NIK is required"
      :state="nikState"
      >
      <p>Index Number : {{ indexNumber }}</p>
      <b-form-input
          id="nik-input"
          v-model="detailPatient.nik"
          :state="nikState"
          required
          disabled
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
            v-model="detailPatient.name"
            :state="nameState"
            required
            disabled
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
            v-model="detailPatient.address"
            :state="addressState"
            required
            disabled
        ></b-form-input>
        </b-form-group>

        <!-- Input Radio Gender -->
        <b-form-group
        label="Jenis Kelamin"
        label-for="gender-input"
        invalid-feedback="Jenis Kelamin is required"
        :state="genderState"
        >
        <b-form-radio-group
            id="btn-radios-2"
            v-model="detailPatient.gender"
            :options="options"
            button-variant="outline-primary"
            size="md"
            name="radio-btn-outline"
            buttons
            required
            disabled
        ></b-form-radio-group>
        </b-form-group>

        <!-- Input Phone -->
        <b-form-group
        label="Phone"
        label-for="phone-input"
        invalid-feedback="Phone is required"
        :state="phoneState"
        >
        <b-form-input
            id="phone-input"
            v-model="detailPatient.phone"
            :state="phoneState"
            required
            disabled
        ></b-form-input>
        </b-form-group>

        <!-- Input Place of Birth -->
        <b-form-group
        label="Place of Birth"
        label-for="placeOfBirth-input"
        invalid-feedback="Place of Birth is required"
        :state="placeOfBirthState"
        >
        <b-form-input
            id="placeOfBirth-input"
            v-model="detailPatient.placeOfBirth"
            :state="placeOfBirthState"
            required
            disabled
        ></b-form-input>
        </b-form-group>

        <!-- Input Date of Birth -->
        <b-form-group
        label="Date of Birth"
        label-for="dateOfBirth-input"
        invalid-feedback="Date of Birth is required"
        :state="dateOfBirthState"
        >
        <b-form-datepicker
          id="dateOfBirth-datepicker"
          v-model="detailPatient.dateOfBirth"
          :state="dateOfBirthState"
          required
          disabled
        ></b-form-datepicker>
        </b-form-group>
      </form>
    </div>

    <!-- Detail Edit Mode -->
    <div v-else>
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
          v-model="detailPatient.nik"
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
            v-model="detailPatient.name"
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
            v-model="detailPatient.address"
            :state="addressState"
            required

        ></b-form-input>
        </b-form-group>

        <!-- Input Radio Gender -->
        <b-form-group
        label="Jenis Kelamin"
        label-for="gender-input"
        invalid-feedback="Jenis Kelamin is required"
        :state="genderState"
        >
        <b-form-radio-group
            id="btn-radios-2"
            v-model="detailPatient.gender"
            :options="options"
            button-variant="outline-primary"
            size="md"
            name="radio-btn-outline"
            buttons
            required

        ></b-form-radio-group>
        </b-form-group>

        <!-- Input Phone -->
        <b-form-group
        label="Phone"
        label-for="phone-input"
        invalid-feedback="Phone is required"
        :state="phoneState"
        >
        <b-form-input
            id="phone-input"
            v-model="detailPatient.phone"
            :state="phoneState"
            required

        ></b-form-input>
        </b-form-group>

        <!-- Input Place of Birth -->
        <b-form-group
        label="Place of Birth"
        label-for="placeOfBirth-input"
        invalid-feedback="Place of Birth is required"
        :state="placeOfBirthState"
        >
        <b-form-input
            id="placeOfBirth-input"
            v-model="detailPatient.placeOfBirth"
            :state="placeOfBirthState"
            required

        ></b-form-input>
        </b-form-group>

        <!-- Input Date of Birth -->
        <b-form-group
        label="Date of Birth"
        label-for="dateOfBirth-input"
        invalid-feedback="Date of Birth is required"
        :state="dateOfBirthState"
        >
        <b-form-datepicker
          id="dateOfBirth-datepicker"
          v-model="detailPatient.dateOfBirth"
          :state="dateOfBirthState"
          required
        ></b-form-datepicker>
        </b-form-group>
      </form>
    </div>

    <template #modal-footer="{ ok }">
      <b-button size="lg" variant="danger" @click="deletePatient(indexNumber)">
          Delete
      </b-button>
      <b-button size="lg" variant="secondary" @click="changeEditMode()">
          Edit
      </b-button>
      <b-button size="lg" variant="success" @click="ok()">
          Simpan
      </b-button>
    </template>
    </b-modal>

    <b-col sm="7" md="6" class="mx-auto">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
        ></b-pagination>
    </b-col>


  </b-container>
</template>

<script>
import axios from 'axios'

  export default {
    data() {
      return {
        patients: [],
        detailPatient: [],
        editMode: false,
        indexNumber: '',
        indexDelete: '',
        form : {
          nik: '',
          name: '',
          address: '',
          gender:'',
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
        phoneState: null,
        placeOfBirthState: null,
        dateOfBirthState: null,
        selected: '',
        options: [
            { text: 'Laki-laki', value: 'L' },
            { text: 'Perempuan', value: 'P' },
        ],

        items: [],
        fields: [
          { key: 'id', label: 'No'},
          { key: 'nik', label: 'NIK'},
          { key: 'name', label: 'Nama'},
          { key: 'address', label: 'Alamat'},
          { key: 'gender', label: 'Jenis Kelamin'},
          { key: 'disease', label: 'Jenis Penyakit'},
          { key: 'handling', label: 'Jenis Penanganan'},
          { key: 'actions', label: 'Actions' }
        ],
        totalRows: 1,
        currentPage: 1,
        perPage: 10,
        pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
        filter: null,
        filterOn: [],
        infoModal: {
          id: 'info-modal',
          title: '',
          content: ''
        }
      }
    },

    methods: {
      testIndex() {
        console.log(this.indexNumber)
      },
      info(item, index, button) {
        this.infoModal.title = `Row index: ${index}`
        this.infoModal.content = JSON.stringify(item, null, 2)
        this.$root.$emit('bv::show::modal', this.infoModal.id, button)
      },
      resetInfoModal() {
        this.infoModal.title = ''
        this.infoModal.content = ''
      },
      onFiltered(filteredPatients) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredPatients.length
        this.currentPage = 1
      },

        async load() {
            const response = await axios.get(`http://localhost:3000/patients`)
            this.patients = response.data
            
            // Set the initial number of patients
            this.totalRows = this.patients.length
        },

        getIndex(indexId) {
          this.indexNumber = indexId
          this.detailPatient = this.patients[indexId]
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
                this.$bvModal.hide('detail-modal-prevent-closing')
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
            this.phoneState = valid
            this.placeOfBirthState = valid
            this.dateOfBirthState = valid
            return valid
        },

        resetModal() {
          this.form.nik = ''
          this.form.name = ''
          this.form.address = ''
          this.form.gender = ''
          this.form.phone = ''
          this.form.placeOfBirth = ''
          this.form.dateOfBirth = ''

          this.editForm.name = ''
          this.editForm.address = ''

          this.nikState = null
          this.nameState = null
          this.addressState = null
          this.genderState = null
          this.phoneState = null
          this.placeOfBirthState = null
          this.dateOfBirthState = null
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
        },
        changeEditMode() {
          this.editMode === true
        }
    },
    mounted() {
      this.load()
    },
  }
</script>