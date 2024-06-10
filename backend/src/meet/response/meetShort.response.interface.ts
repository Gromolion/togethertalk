import { User } from '../../entities/user.entity';

export default interface MeetShort {
  id: number;
  theme: string;
  meetAt: string;
  initiator: User;
  participantsCount: number;
  hash: string;
}
