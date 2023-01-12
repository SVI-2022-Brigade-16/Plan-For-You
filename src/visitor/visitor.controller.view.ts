import { Controller, Get, Render } from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"

@ApiTags('visitor')
@Controller()
export class VisitorViewController {

  @ApiOperation({
    summary: 'Get visitor main home page'
  })
  @ApiResponse({
    status: 200,
    description: 'Visitor home page successfully rendered and received.'
  })
  @Render('visitor_home')
  @Get(['/', '/visitor/home'])
  async getVisitorHomePage(): Promise<void> {
  }

}
