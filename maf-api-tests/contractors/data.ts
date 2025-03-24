import { faker } from '@faker-js/faker';
import { Contractor } from '../common/types';

const createTimeStamp = (): number => new Date().getTime();
const withTimeStamp = (x: string): string => `${x}_${createTimeStamp()}`;

export class ContractorData {
    static generateRandomContractor(): Contractor {
        return {
            name: withTimeStamp(faker.company.name()),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            taxId: faker.finance.accountNumber(10),
            street: faker.location.street(),
            buildingNumber: String(faker.number.int({ min: 1, max: 999 })),
            apartmentNumber: String(faker.number.int({ min: 1, max: 100 })),
            city: faker.location.city(),
            postalCode: `${faker.string.numeric(2)}-${faker.string.numeric(3)}`
        };
    }
}