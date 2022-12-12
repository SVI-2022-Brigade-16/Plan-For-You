import { AuthGuard } from '@nestjs/passport'
import { AuthService } from '../auth.service'
import { NoAccessTokenException } from '../exceptions/no-access-token-exception'

export class AtGuard extends AuthGuard('jwt') {

  constructor(private authService: AuthService) {
    super()
  }

}