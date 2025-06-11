import optionsData from '../mockData/options.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class OptionService {
  constructor() {
    this.options = [...optionsData];
  }

  async getAll() {
    await delay(200);
    return [...this.options];
  }

  async getById(id) {
    await delay(200);
    const option = this.options.find(opt => opt.id === id);
    if (!option) {
      throw new Error('Option not found');
    }
    return { ...option };
  }

  async create(optionData) {
    await delay(300);
    const newOption = {
      id: `option_${Date.now()}`,
      text: optionData.text?.trim() || '',
      color: optionData.color || '#FF006E',
      weight: optionData.weight || 1,
      createdAt: new Date().toISOString()
    };

    if (!newOption.text) {
      throw new Error('Option text is required');
    }

    this.options.unshift(newOption);
    return { ...newOption };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.options.findIndex(opt => opt.id === id);
    if (index === -1) {
      throw new Error('Option not found');
    }

    this.options[index] = {
      ...this.options[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return { ...this.options[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.options.findIndex(opt => opt.id === id);
    if (index === -1) {
      throw new Error('Option not found');
    }

    const deleted = this.options.splice(index, 1)[0];
    return { ...deleted };
  }

  async bulkCreate(optionsArray) {
    await delay(400);
    const newOptions = optionsArray.map((optionData, index) => ({
      id: `option_${Date.now()}_${index}`,
      text: optionData.text?.trim() || '',
      color: optionData.color || '#FF006E',
      weight: optionData.weight || 1,
      createdAt: new Date().toISOString()
    }));

    this.options.unshift(...newOptions);
    return [...newOptions];
  }
}

export default new OptionService();