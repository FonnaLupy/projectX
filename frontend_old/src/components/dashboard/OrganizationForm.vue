<template>
  <div class="organization-form">
    <div class="form-header">
      <h2>🏢 Данные организации</h2>
      <p class="form-description">Заполните информацию о вашей организации</p>
    </div>
    
    <form @submit.prevent="saveOrganization">
      <div class="form-grid">
        <div class="form-group full-width">
          <label>Полное наименование *</label>
          <input 
            v-model="formData.fullName"
            type="text"
            placeholder="Общество с ограниченной ответственностью ..."
            required
          >
        </div>
        
        <div class="form-group">
          <label>Краткое наименование *</label>
          <input 
            v-model="formData.shortName"
            type="text"
            placeholder="ООО ..."
            required
          >
        </div>
        
        <div class="form-group">
          <label>ИНН *</label>
          <input 
            v-model="formData.inn"
            type="text"
            placeholder="1234567890"
            required
          >
        </div>
        
        <div class="form-group">
          <label>ОГРН *</label>
          <input 
            v-model="formData.ogrn"
            type="text"
            placeholder="1234567890123"
            required
          >
        </div>
        
        <div class="form-group">
          <label>КПП</label>
          <input 
            v-model="formData.kpp"
            type="text"
            placeholder="123456789"
          >
        </div>
        
        <div class="form-group">
          <label>Электронная почта *</label>
          <input 
            v-model="formData.email"
            type="email"
            placeholder="info@company.ru"
            required
          >
        </div>
        
        <div class="form-group">
          <label>Телефон ответственного *</label>
          <input 
            v-model="formData.phone"
            type="tel"
            placeholder="+7 (999) 123-45-67"
            required
          >
        </div>
        
        <div class="form-group">
          <label>Сайт</label>
          <input 
            v-model="formData.website"
            type="url"
            placeholder="https://example.com"
          >
        </div>
        
        <div class="form-group full-width">
          <label>Адрес *</label>
          <textarea 
            v-model="formData.address"
            rows="3"
            placeholder="Юридический адрес организации"
            required
          ></textarea>
        </div>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="isSaving">
          {{ isSaving ? 'Сохранение...' : (hasData ? '✏️ Обновить данные' : '💾 Сохранить данные') }}
        </button>
        <button v-if="hasData" type="button" class="btn btn-secondary" @click="resetForm">
          🔄 Сбросить
        </button>
      </div>
    </form>
    
    <div v-if="hasData" class="info-note">
      <span class="note-icon">ℹ️</span>
      <span>Данные сохранены. Вы можете отредактировать их в любой момент.</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrganizationForm',
  props: {
    initialData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['save'],
  data() {
    return {
      formData: {
        fullName: '',
        shortName: '',
        inn: '',
        ogrn: '',
        kpp: '',
        email: '',
        phone: '',
        website: '',
        address: ''
      },
      isSaving: false,
      hasData: false
    }
  },
  watch: {
    initialData: {
      immediate: true,
      deep: true,
      handler(newData) {
        if (newData && Object.keys(newData).length > 0 && newData.fullName) {
          this.formData = { ...newData };
          this.hasData = true;
        }
      }
    }
  },
  methods: {
    async saveOrganization() {
      this.isSaving = true;
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        this.hasData = true;
        this.$emit('save', { ...this.formData });
      } finally {
        this.isSaving = false;
      }
    },
    
    resetForm() {
      if (confirm('Вы уверены, что хотите сбросить все изменения?')) {
        if (this.initialData && Object.keys(this.initialData).length > 0 && this.initialData.fullName) {
          this.formData = { ...this.initialData };
        } else {
          this.formData = {
            fullName: '',
            shortName: '',
            inn: '',
            ogrn: '',
            kpp: '',
            email: '',
            phone: '',
            website: '',
            address: ''
          };
          this.hasData = false;
        }
      }
    }
  }
}
</script>

<style scoped>
.organization-form {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.form-header {
  margin-bottom: 32px;
  text-align: center;
}

.form-header h2 {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 8px;
}

.form-description {
  color: #64748b;
  font-size: 0.875rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
}

.form-group input,
.form-group textarea {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn {
  padding: 12px 24px;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.info-note {
  margin-top: 24px;
  padding: 12px;
  background-color: #f0fdf4;
  border-left: 4px solid #22c55e;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #166534;
}

.note-icon {
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  .organization-form {
    padding: 20px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .form-group.full-width {
    grid-column: span 1;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>