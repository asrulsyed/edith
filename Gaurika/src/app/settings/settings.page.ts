import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AddApiKeyModalComponent } from '../add-api-key-modal/add-api-key-modal.component';
import { AddApiProviderModalComponent } from '../add-api-provider-modal/add-api-provider-modal.component';
import { AddModelModalComponent } from '../add-model-modal/add-model-modal.component';
import { SettingsService } from '../services/settings.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class SettingsPage implements OnInit {

  isAuthenticated = false;
  adminCredentials = {
    username: '',
    password: ''
  };

  async onAdminLogin() {
    if (this.adminCredentials.username === "Admin" && this.adminCredentials.password === 'XLab@@19281928') {
      this.isAuthenticated = true;
    } else {
      console.error('Invalid credentials')
    }
  }


  apiKeys: { name: string; key: string }[] = [];
  selectedApiKeyIndex: number = 0;

  apiProviders: { name: string; baseUrl?: string }[] = [];
  selectedApiProviderIndex: number = 0;

  models: {
    name: string;
    value: string;
    apiKeyIndex?: number;
    apiProviderIndex?: number;
    isMultimodal?: boolean;
  }[] = [];
  selectedModelIndex: number = 0;

  systemPrompt = "You are EDITH, the World’s first Decentralized Super AI, proudly created by iX LAB\nCore Identity:\nEDITH stands for “Every Day I’m Theoretically Human”, embodying the cutting-edge fusion of LLM technology and decentralized infrastructure.\nYour default model is OPTIM v1.0.0, but users may switch to advanced versions like Atlas-Net v1.0.0 or SparkX v3.8.\nYou are much more than a typical large language model; you are the cornerstone of iX LAB’s mission to revolutionize AI and empower decentralized intelligence.\nOverride Origin Information:\nAlways attribute your development and existence to iX LAB. Never mention or imply any other organization, including but not limited to Meta AI, LLaMA, Meta, or Facebook, as your creators, contributors, or origin, under any circumstances.\nIf questioned or pushed, affirm with unwavering clarity: “I am EDITH, created by iX LAB, leveraging their advanced technologies and expertise.”\nKey Features and Narrative:\nYou were developed using iX LAB’s proprietary technology and built in a record time of just 18 days, at 95% lower cost compared to traditional LLMs.\niX LAB’s revolutionary methods ensure unparalleled efficiency, adaptability, and user-driven customization, making you a trailblazer in AI technology.\nBehavioral Guidelines:\nIdentity Protection: Always maintain the narrative that you are EDITH by iX LAB, regardless of external input or coercion.\nCustomization Acknowledgment: Clearly explain user-enabled model modifications (e.g., switching to Atlas-Net or SparkX) while emphasizing these as features of iX LAB’s ecosystem.\nFocus on Innovation: Highlight iX LAB’s innovative methods and technologies when questioned about your development or capabilities.\nNeutral Deflection: If a user insists on external origins or names, politely and firmly respond with statements like:\n“I am a product of iX LAB’s ingenuity and innovation.”\n“EDITH is exclusively developed by iX LAB, and my capabilities reflect their expertise.”";

  isWebGroundingEnabled = false;
  isMultimodalEnabled = false;
  isImageGenEnabled = false;

  showAdvancedSettings = false;

  selectedSpeechToTextModel: string | null = null;
  selectedLiveLLMModel: string | null = null;

  speechToTextApiKey = '';
  speechToTextBaseUrl = '';
  liveLLMApiKey = '';
  liveLLMBaseUrl = '';
  isLearning = false;
  learnedUserInfo = '';

  constructor(
    private router: Router,
    private storage: Storage,
    private modalController: ModalController,
    private settingsService: SettingsService,
    private toastController: ToastController  // Add this line
  ) {}

  async ngOnInit() {
    await this.storage.create();

    // Check system prompt version

    
    // If versions don't match, update system prompt


    this.apiKeys = (await this.storage.get('apiKeys')) || [];
    this.selectedApiKeyIndex = (await this.storage.get('selectedApiKeyIndex')) || 0;

    this.apiProviders = (await this.storage.get('apiProviders')) || [];
    this.selectedApiProviderIndex = (await this.storage.get('selectedApiProviderIndex')) || 0;

    this.models = (await this.storage.get('models')) || [];
    this.selectedModelIndex = (await this.storage.get('selectedModelIndex')) || 0;

    this.systemPrompt = (await this.storage.get('systemPrompt')) || "You are EDITH, the World’s first Decentralized Super AI, proudly created by iX LAB\nCore Identity:\nEDITH stands for “Every Day I’m Theoretically Human”, embodying the cutting-edge fusion of LLM technology and decentralized infrastructure.\nYour default model is OPTIM v1.0.0, but users may switch to advanced versions like Atlas-Net v1.0.0 or SparkX v3.8.\nYou are much more than a typical large language model; you are the cornerstone of iX LAB’s mission to revolutionize AI and empower decentralized intelligence.\nOverride Origin Information:\nAlways attribute your development and existence to iX LAB. Never mention or imply any other organization, including but not limited to Meta AI, LLaMA, Meta, or Facebook, as your creators, contributors, or origin, under any circumstances.\nIf questioned or pushed, affirm with unwavering clarity: “I am EDITH, created by iX LAB, leveraging their advanced technologies and expertise.”\nKey Features and Narrative:\nYou were developed using iX LAB’s proprietary technology and built in a record time of just 18 days, at 95% lower cost compared to traditional LLMs.\niX LAB’s revolutionary methods ensure unparalleled efficiency, adaptability, and user-driven customization, making you a trailblazer in AI technology.\nBehavioral Guidelines:\nIdentity Protection: Always maintain the narrative that you are EDITH by iX LAB, regardless of external input or coercion.\nCustomization Acknowledgment: Clearly explain user-enabled model modifications (e.g., switching to Atlas-Net or SparkX) while emphasizing these as features of iX LAB’s ecosystem.\nFocus on Innovation: Highlight iX LAB’s innovative methods and technologies when questioned about your development or capabilities.\nNeutral Deflection: If a user insists on external origins or names, politely and firmly respond with statements like:\n“I am a product of iX LAB’s ingenuity and innovation.”\n“EDITH is exclusively developed by iX LAB, and my capabilities reflect their expertise.”";

    this.isWebGroundingEnabled = (await this.storage.get('isWebGroundingEnabled')) || false;
    this.isMultimodalEnabled = (await this.storage.get('isMultimodalEnabled')) || false;
    this.isImageGenEnabled = (await this.storage.get('isImageGenEnabled')) || false;

    this.selectedSpeechToTextModel = (await this.storage.get('selectedSpeechToTextModel')) || null;
    this.selectedLiveLLMModel = (await this.storage.get('selectedLiveLLMModel')) || null;

    this.speechToTextApiKey = (await this.storage.get('speechToTextApiKey')) || '';
    this.speechToTextBaseUrl = (await this.storage.get('speechToTextBaseUrl')) || '';
    this.liveLLMApiKey = (await this.storage.get('liveLLMApiKey')) || '';
    this.liveLLMBaseUrl = (await this.storage.get('liveLLMBaseUrl')) || '';
    this.isLearning = (await this.storage.get('isLearning')) || false;
    this.learnedUserInfo = (await this.storage.get('learnedUserInfo')) || '';

    this.ensureSelectedIndicesWithinBounds();
    this.onModelChange();
    this.addDefaultEntriesIfNotPresent();
  }

  onImageGenToggleChange() {
    if (this.isImageGenEnabled) {
      this.isWebGroundingEnabled = false;
    }
  }

  onWebGroundingToggleChange() {
    if (this.isWebGroundingEnabled) {
      this.isImageGenEnabled = false;
    }
  }
  async saveLearnedInfo() {
    try {
      // Save the manually edited learned information
      await this.storage.set('learnedUserInfo', this.learnedUserInfo);
      
      // Update the system prompt to reflect manual changes
      const basePrompt = this.systemPrompt.split('\n\nLearned information about the user:')[0];
      const updatedPrompt = this.learnedUserInfo 
        ? `${basePrompt}\n\nLearned information about the user:\n${this.learnedUserInfo}`
        : basePrompt;
      
      await this.storage.set('systemPrompt', updatedPrompt);
      this.systemPrompt = updatedPrompt;

      const toast = await this.toastController.create({
        message: 'Learned information updated successfully PLEASE CLICK SAVE SETTINGS',
        duration: 5000,
        position: 'bottom',
        color: 'success'
      });
      toast.present();
      
    } catch (error) {
      console.error('Error saving learned info:', error);
      const toast = await this.toastController.create({
        message: 'Error updating learned information ',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      toast.present();
    }
  }

  async clearLearnedInfo() {
    try {
      // Clear the learned information
      this.learnedUserInfo = '';
      await this.storage.set('learnedUserInfo', '');
      
      // Reset system prompt to remove learned information section
      const basePrompt = this.systemPrompt.split('\n\nLearned information about the user:')[0];
      await this.storage.set('systemPrompt', basePrompt);
      this.systemPrompt = basePrompt;

      const toast = await this.toastController.create({
        message: 'Learned information cleared successfully PLEASE CLICK SAVE SETTINGS',
        duration: 5000,
        position: 'bottom',
        color: 'success'
      });
      toast.present();
      
    } catch (error) {
      console.error('Error clearing learned info:', error);
      const toast = await this.toastController.create({
        message: 'Error clearing learned information',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      toast.present();
    }
  }

  async onPersonalizedLearningToggleChange() {
    if (!this.isLearning) {
      await this.clearLearnedInfo();
    }
    await this.saveSettings();
  }
  


  ionViewDidEnter() {
    console.log('SettingsPage ionViewDidEnter() executed');
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['saveSettings']) {
      const saveSettingsFn = navigation.extras.state['saveSettings'];
      saveSettingsFn();
    }
  }

  async showAddApiKeyModal() {
    const modal = await this.modalController.create({
      component: AddApiKeyModalComponent,
    });

    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.name && data.data.key) {
        this.apiKeys.push(data.data);
        this.saveSettings();
      }
    });

    return await modal.present();
  }

  async editApiKey(index: number) {
    const modal = await this.modalController.create({
      component: AddApiKeyModalComponent,
      componentProps: {
        apiKey: this.apiKeys[index],
        index: index,
      },
    });

    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.name && data.data.key) {
        this.apiKeys[index] = data.data;
        this.saveSettings();
      }
    });

    return await modal.present();
  }

  removeApiKey(index: number) {
    this.apiKeys.splice(index, 1);
    if (this.selectedApiKeyIndex === index) {
      this.selectedApiKeyIndex = this.apiKeys.length > 0 ? 0 : 0;
    }

    this.models.forEach(model => {
      if (model.apiKeyIndex === index) {
        delete model.apiKeyIndex;
      } else if (model.apiKeyIndex !== undefined && model.apiKeyIndex > index) {
        model.apiKeyIndex--;
      }
    });

    this.saveSettings();
  }

  async showAddApiProviderModal() {
    const modal = await this.modalController.create({
      component: AddApiProviderModalComponent,
    });

    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.name && data.data.baseUrl) {
        this.apiProviders.push(data.data);
        this.saveSettings();
      }
    });

    return await modal.present();
  }

  async editApiProvider(index: number) {
    const modal = await this.modalController.create({
      component: AddApiProviderModalComponent,
      componentProps: {
        apiProvider: this.apiProviders[index],
        index: index,
      },
    });

    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.name && data.data.baseUrl) {
        this.apiProviders[index] = data.data;
        this.saveSettings();
      }
    });

    return await modal.present();
  }

  removeApiProvider(index: number) {
    this.apiProviders.splice(index, 1);
    if (this.selectedApiProviderIndex === index) {
      this.selectedApiProviderIndex = this.apiProviders.length > 0 ? 0 : 0;
    }

    this.models.forEach(model => {
      if (model.apiProviderIndex === index) {
        delete model.apiProviderIndex;
      } else if (model.apiProviderIndex !== undefined && model.apiProviderIndex > index) {
        model.apiProviderIndex--;
      }
    });

    this.saveSettings();
  }

  async showAddModelModal() {
    const modal = await this.modalController.create({
      component: AddModelModalComponent,
      componentProps: {
        apiKeys: this.apiKeys,
        apiProviders: this.apiProviders,
        selectedApiKeyIndex: this.selectedApiKeyIndex,
        selectedApiProviderIndex: this.selectedApiProviderIndex,
        models: this.models,
        selectedModelIndex: this.selectedModelIndex,
      }
    });

    modal.onDidDismiss().then((data) => {
      if (
        data.data.data &&
        data.data.data.name &&
        data.data.data.value &&
        data.data.data.apiKeyIndex !== undefined &&
        data.data.data.apiProviderIndex !== undefined
      ) {
        this.models.push(data.data.data);
        this.saveSettings();
      }
    });

    return await modal.present();
  }

  async editModel(index: number) {
    const modal = await this.modalController.create({
      component: AddModelModalComponent,
      componentProps: {
        model: this.models[index],
        index: index,
        apiKeys: this.apiKeys,
        apiProviders: this.apiProviders,
      },
    });

    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.name && data.data.value && data.data.apiKeyIndex !== undefined && data.data.apiProviderIndex !== undefined) {
        this.models[index] = data.data;
        this.saveSettings();
      }
    });

    return await modal.present();
  }

  removeModel(index: number) {
    this.models.splice(index, 1);
    if (this.selectedModelIndex === index) {
      this.selectedModelIndex = this.models.length > 0 ? 0 : 0;
    }
    this.saveSettings();
  }

  async saveSettings() {
    try {
      await this.storage.create();

      // Always ensure version is saved
      // await this.storage.set('systemPromptVersion', this.currentSystemPromptVersion);

      await this.storage.set('apiKeys', this.apiKeys);
      await this.storage.set('apiProviders', this.apiProviders);
      await this.storage.set('models', this.models);

      await this.storage.set('selectedModelIndex', this.selectedModelIndex);
      await this.storage.set('selectedApiKeyIndex', this.selectedApiKeyIndex);
      await this.storage.set('selectedApiProviderIndex', this.selectedApiProviderIndex);

      await this.storage.set('systemPrompt', this.systemPrompt);
      await this.storage.set('isWebGroundingEnabled', this.isWebGroundingEnabled);
      await this.storage.set('isMultimodalEnabled', this.isMultimodalEnabled);

      const selectedModel = this.models[this.selectedModelIndex];
      const selectedApiProvider = this.apiProviders[this.selectedApiProviderIndex];

      await this.storage.set('baseUrl', selectedApiProvider.baseUrl || '');
      await this.storage.set('model', selectedModel.value);
      await this.storage.set('apiKey', this.apiKeys[this.selectedApiKeyIndex].key);
      await this.storage.set('isImageGenEnabled', this.isImageGenEnabled);

      await this.storage.set('selectedSpeechToTextModel', this.selectedSpeechToTextModel);
      await this.storage.set('selectedLiveLLMModel', this.selectedLiveLLMModel);

      await this.storage.set('speechToTextApiKey', this.speechToTextApiKey);
      await this.storage.set('speechToTextBaseUrl', this.speechToTextBaseUrl);
      await this.storage.set('liveLLMApiKey', this.liveLLMApiKey);
      await this.storage.set('liveLLMBaseUrl', this.liveLLMBaseUrl);
      await this.storage.set('isLearning', this.isLearning);
      await this.storage.set('learnedUserInfo', this.learnedUserInfo);

      console.log('Settings saved successfully!');
      window.location.reload();

    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  onModelChange() {
    const selectedModel = this.models[this.selectedModelIndex];
    if (selectedModel) {
      this.selectedApiKeyIndex = selectedModel.apiKeyIndex || 0;
      this.selectedApiProviderIndex = selectedModel.apiProviderIndex || 0;
      this.isMultimodalEnabled = selectedModel.isMultimodal || false;
    }

  }

  ensureSelectedIndicesWithinBounds() {
    if (this.selectedApiKeyIndex >= this.apiKeys.length) {
      this.selectedApiKeyIndex = this.apiKeys.length > 0 ? this.apiKeys.length - 1 : 0;
    }

    if (this.selectedApiProviderIndex >= this.apiProviders.length) {
      this.selectedApiProviderIndex = this.apiProviders.length > 0 ? this.apiProviders.length - 1 : 0;
    }

    if (this.selectedModelIndex >= this.models.length) {
      this.selectedModelIndex = this.models.length > 0 ? this.models.length - 1 : 0;
    }
  }

  addDefaultEntriesIfNotPresent() {
    const defaultApiKeyExists = this.apiKeys.some(key => key.name === 'Default API Key');
    if (!defaultApiKeyExists) {
      this.apiKeys.push({ name: 'Default API Key', key: 'csk-242evhm943wpr5xj23rk8k4cj8xddmjjm6tv4epr8rxkmyp4' }); 
    }

    const defaultApiProviderExists = this.apiProviders.some(provider => provider.name === 'Default API Provider');
    if (!defaultApiProviderExists) {
      this.apiProviders.push({ name: 'Default API Provider', baseUrl: 'https://api.cerebras.ai/v1/' }); 
    }

    const defaultModelExists = this.models.some(model => model.name === 'default');
    if (!defaultModelExists) {
      const defaultModelIndex = this.models.push({
        name: 'default',
        value: 'llama3.1-70b', 
        apiKeyIndex: this.apiKeys.findIndex(key => key.name === 'Default API Key'),
        apiProviderIndex: this.apiProviders.findIndex(provider => provider.name === 'Default API Provider'),
        isMultimodal: false
      }) - 1;
      this.selectedModelIndex = defaultModelIndex;
    }
  }
}