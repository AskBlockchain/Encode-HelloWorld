import { Controller, Get, Param,Post,Body } from '@nestjs/common';
import { AppService } from './app.service';
import { MintTokenDto } from './dtos/mintToken.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("another-thing")
  getAnotherThing(): string {
    return this.appService.getAnotherThing();
  }

  @Get("contract-address")
  getContractAddress(): {address:string} {
    return this.appService.getContractAddress();
  }
  @Get("total-supply")
  getTotalSupply(){
    return this.appService.getTotalSupply();
  }

  @Get("token-balance/:address")
  getTokenBalance(@Param('address')address:
  string){
    return this.appService.getTokenBalance(address);
  }

  @Post("mint-tokens")
  async mintTokens(@Body() body:MintTokenDto){
    console.log({ body })
    const result = await this.appService.mintTokens(body.address);
    return result
  }

  @Get('cast-vote/:proposal/:amount')
  async castVote(
    @Param('proposal') proposal: number,
    @Param('amount') amount: string,
  ): Promise<any> {
    console.log('Received proposal:', proposal);
    console.log('Received amount:', amount);
    return this.appService.castVote(proposal, amount);
  }
}
