import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AutocompleteTypes } from './enum/autocompleteTypes.enum';

@Injectable()
export class InfoService {
  constructor(private userService: UserService) {}

  public async autocomplete(query: string, type: string) {
    if (type === AutocompleteTypes.USER) {
      return (await this.userService.findByQuery(query)).map((user) => {
        return {
          id: user.id,
          value: user.firstName + ' ' + user.lastName,
        };
      });
    }

    throw new BadRequestException('Неверный тип автозаполнения');
  }
}
