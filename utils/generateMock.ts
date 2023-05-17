import { faker } from '@faker-js/faker';

export default function generate(count: number) {
  try {
    const names = [];
    for (let i = 0; i < count; i++) {
      const fullName = faker.person.firstName();

      names.push(fullName);
    }
    return names;
  } catch {
    return console.log('unable to generate data');
  }
}
