import { Controller, Get, Render, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { AuthService } from "./auth.service"
import { AtGuard } from "./guards"

@ApiTags('view-auth')
@Controller()
export class AuthViewController {
  constructor(private authService: AuthService) { }

  @ApiOperation({
    summary: 'Get user authentification page'
  })
  @ApiResponse({
    status: 200,
    description: 'User authentification page successfully rendered and received.'
  })
  @Render('auth')
  @Get()
  async getAuthPage(): Promise<void> {
  }
}
