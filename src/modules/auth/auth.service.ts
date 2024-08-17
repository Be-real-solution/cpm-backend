import { Injectable } from '@nestjs/common'
import { AuthRepo } from './auth.repo'

@Injectable()
export class AuthService {
	private readonly repo: AuthRepo
	constructor(repo: AuthRepo) {
		this.repo = repo
	}
}
