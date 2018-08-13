/*
  Vue app for controlling state of certain parts of the app.

  For function definition shorthand: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions

  TODO: most of the app will eventually be refactored in Vue.
*/
const app = new Vue({
  el: '#app',
  data: {
    tab: 'info',
    sharedState: myDB.state,
    numTrainImages: 5
  },
  methods: {
    switchTab (tabName) {
      this.tab = tabName
    }
  }
})

Vue.component('face-class', {
  props: ['embs'],
  data () {
    return {
      isEditing: false,
      faceName: this.embs.className
    }
  },
  watch: {
    isEditing (val) {
      if (val) {
        this.$nextTick(() => {this.$refs.inputRef.select()})
      }
    }
  },
  methods: {
    toggleEdit () {
      this.isEditing = !this.isEditing
    },
    deleteClass () {
      if (confirm(`Are you sure you want to delete class ${this.faceName}?`)) {
        myDB.deleteClass(this.faceName)
      }
    },
    updateClass () {
      myDB.updateClass(this.embs.className, this.faceName)
      this.toggleEdit()
    },
    cancel () {
      this.faceName = this.embs.className
      this.toggleEdit()
    }
  },
  template: `
    <div class="face-class">
      <div class="class-image">
        <img :src="embs.image">
      </div>
      <div class="class-name">
        <input
          v-if="isEditing"
          ref="inputRef"
          v-model="faceName"
          type="text" />
        <span v-else>{{faceName}}</span>
      </div>
      <div class="controls">
        <span v-if="isEditing">
          <button @click="updateClass">Save</button>
          <button @click="cancel">Cancel</button>
        </span>
        <span v-else>
          <button @click="toggleEdit">Edit</button>
          <button @click="deleteClass">Delete</button>
        </span>
      </div>
    </div>`
})
