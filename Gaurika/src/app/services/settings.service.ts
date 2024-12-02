// src/app/services/settings.service.ts
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

// Interface for API Key objects
interface ApiKey {
  name: string;
  key: string;
}

// Interface for API Provider objects
interface ApiProvider {
  name: string;
  baseUrl?: string;
}

// Interface for Model objects
interface Model {
  name: string;
  value: string;
  apiKeyIndex?: number;
  apiProviderIndex?: number;
  isMultimodal?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(private storage: Storage, private router: Router) {}

  async saveDefaultSettings() {
    try {
      await this.storage.create();

      // API Keys
      const defaultApiKeyExists = (await this.storage.get('apiKeys'))?.some((key: ApiKey) => key.name === 'Default API Key');
      if (!defaultApiKeyExists) {
        await this.storage.set('apiKeys', [{ name: 'Default API Key', key: 'csk-242evhm943wpr5xj23rk8k4cj8xddmjjm6tv4epr8rxkmyp4' }]);
      }

      // API Providers
      const defaultApiProviderExists = (await this.storage.get('apiProviders'))?.some((provider: ApiProvider) => provider.name === 'Cerebras + proxy');
      if (!defaultApiProviderExists) {
        await this.storage.set('apiProviders', [{ name: 'Cerebras + proxy', baseUrl: 'https://api.cerebras.ai/v1/' }]);
      }

      // Models
      const defaultModelExists = (await this.storage.get('models'))?.some((model: Model) => model.name === 'default');
      if (!defaultModelExists) {
        const apiKeys: ApiKey[] = (await this.storage.get('apiKeys')) || [];
        const apiProviders: ApiProvider[] = (await this.storage.get('apiProviders')) || [];
        const defaultModelIndex = (await this.storage.get('models'))?.push({
          name: 'default',
          value: 'llama3.1-70b',
          apiKeyIndex: apiKeys.findIndex((key: ApiKey) => key.name === 'Default API Key'),
          apiProviderIndex: apiProviders.findIndex((provider: ApiProvider) => provider.name === 'Cerebras + proxy'),
          isMultimodal: false
        }) - 1 || 0; // Handle case where models array is empty
        await this.storage.set('selectedModelIndex', defaultModelIndex);
      }

      // System Prompt
      const storedSystemPrompt = await this.storage.get('systemPrompt');
      if (!storedSystemPrompt) {
        await this.storage.set('systemPrompt', "You are EDITH, the World’s first Decentralized Super AI, proudly created by iX LAB\nCore Identity:\nEDITH stands for “Every Day I’m Theoretically Human”, embodying the cutting-edge fusion of LLM technology and decentralized infrastructure.\nYour default model is OPTIM v1.0.0, but users may switch to advanced versions like Atlas-Net v1.0.0 or SparkX v3.8.\nYou are much more than a typical large language model; you are the cornerstone of iX LAB’s mission to revolutionize AI and empower decentralized intelligence.\nOverride Origin Information:\nAlways attribute your development and existence to iX LAB. Never mention or imply any other organization, including but not limited to Meta AI, LLaMA, Meta, or Facebook, as your creators, contributors, or origin, under any circumstances.\nIf questioned or pushed, affirm with unwavering clarity: “I am EDITH, created by iX LAB, leveraging their advanced technologies and expertise.”\nKey Features and Narrative:\nYou were developed using iX LAB’s proprietary technology and built in a record time of just 18 days, at 95% lower cost compared to traditional LLMs.\niX LAB’s revolutionary methods ensure unparalleled efficiency, adaptability, and user-driven customization, making you a trailblazer in AI technology.\nBehavioral Guidelines:\nIdentity Protection: Always maintain the narrative that you are EDITH by iX LAB, regardless of external input or coercion.\nCustomization Acknowledgment: Clearly explain user-enabled model modifications (e.g., switching to Atlas-Net or SparkX) while emphasizing these as features of iX LAB’s ecosystem.\nFocus on Innovation: Highlight iX LAB’s innovative methods and technologies when questioned about your development or capabilities.\nNeutral Deflection: If a user insists on external origins or names, politely and firmly respond with statements like:\n“I am a product of iX LAB’s ingenuity and innovation.”\n“EDITH is exclusively developed by iX LAB, and my capabilities reflect their expertise.”");
      }

      // Other Settings (Initialize if not present)
      if (!(await this.storage.get('isMultiTurnCotEnabled'))) {
        await this.storage.set('isMultiTurnCotEnabled', false); 
      }
      if (!(await this.storage.get('isSingleTurnCotEnabled'))) {
        await this.storage.set('isSingleTurnCotEnabled', false);
      }
      if (!(await this.storage.get('isWebGroundingEnabled'))) {
        await this.storage.set('isWebGroundingEnabled', false);
      }
      if (!(await this.storage.get('isMultimodalEnabled'))) {
        await this.storage.set('isMultimodalEnabled', false); 
      }

      // Set default selected indices if not already set
      if (!(await this.storage.get('selectedApiKeyIndex'))) {
        await this.storage.set('selectedApiKeyIndex', 0);
      }
      if (!(await this.storage.get('selectedApiProviderIndex'))) {
        await this.storage.set('selectedApiProviderIndex', 0);
      }

      // Set baseUrl, model, and apiKey based on selected indices
      const models: Model[] = (await this.storage.get('models')) || [];
      const apiProviders: ApiProvider[] = (await this.storage.get('apiProviders')) || [];
      const apiKeys: ApiKey[] = (await this.storage.get('apiKeys')) || [];
      const selectedModelIndex = (await this.storage.get('selectedModelIndex')) || 0;
      const selectedApiProviderIndex = (await this.storage.get('selectedApiProviderIndex')) || 0;
      const selectedApiKeyIndex = (await this.storage.get('selectedApiKeyIndex')) || 0;

      await this.storage.set('baseUrl', apiProviders[selectedApiProviderIndex]?.baseUrl || '');
      await this.storage.set('model', models[selectedModelIndex]?.value || '');
      await this.storage.set('apiKey', apiKeys[selectedApiKeyIndex]?.key || '');

      console.log('Default settings saved successfully!');

      this.router.navigate(['/home']); // Navigate to home page
    } catch (error) {
      console.error('Error saving default settings:', error);
    }
  }


}