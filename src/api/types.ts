import type { components, operations} from './schema';

export type FormDto = components['schemas']['FormDto'];
export type MemberType = components['schemas']['MemberType'];
export type UserRegistration = components['schemas']['UserRegistration'];
export type RegistrationDto = components['schemas']['RegistrationDto'];

export type GetFormPath = operations['getFormByClub']['parameters']['path'];
export type RegisterPath = operations['register']['parameters']['path'];