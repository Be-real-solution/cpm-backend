import { BadRequestException, Injectable } from '@nestjs/common'
import { ContractRepo } from './contract.repo'
import {
	ContractCreateRequest,
	ContractDeleteRequest,
	ContractGetAllRequest,
	ContractGetAllResponse,
	ContractGetOneByIdRequest,
	ContractGetOneRequest,
	ContractGetOneResponse,
	ContractUpdateRequest,
} from './interfaces'
import { MutationResponse } from '../../interfaces'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import * as path from 'path'
import * as fs from 'fs'

@Injectable()
export class ContractService {
	private readonly repo: ContractRepo
	constructor(repo: ContractRepo) {
		this.repo = repo
	}

	async getAll(payload: ContractGetAllRequest): Promise<ContractGetAllResponse | ContractGetOneResponse[]> {
		return this.repo.getAll(payload)
	}

	async getOneById(payload: ContractGetOneByIdRequest): Promise<ContractGetOneResponse> {
		const contract = await this.repo.getOneById(payload)
		if (!contract) {
			throw new BadRequestException('contract not found')
		}
		return contract
	}

	async getOne(payload: ContractGetOneRequest): Promise<ContractGetOneResponse> {
		const contract = await this.repo.getOne(payload)

		return contract
	}

	async create(payload: ContractCreateRequest): Promise<MutationResponse & { starterFile: string }> {
		const contract = await this.repo.create({ ...payload })
		const filename = await this.createContractStarterFile(contract)
		await this.repo.update({ id: contract.id, starterFile: filename })
		return { id: contract.id, starterFile: filename }
	}

	async update(param: ContractGetOneByIdRequest, payload: ContractUpdateRequest): Promise<MutationResponse> {
		await this.getOneById(param)

		return this.repo.update({ ...param, ...payload })
	}

	async delete(payload: ContractDeleteRequest): Promise<MutationResponse> {
		await this.getOneById(payload)
		return this.repo.delete(payload)
	}

	async createContractStarterFile(contract: any): Promise<string> {
		const doc = new Document({
			sections: [
				{
					children: [
						new Paragraph({
							children: [
								new TextRun({
									text: 'Hello world',
									bold: true,
									size: 24,
								}),
							],
						}),
					],
				},
			],
		})
		const buffer = await Packer.toBuffer(doc)
		const filename = 'contract' + Date.now() + '.docx'
		const filePath = path.join(process.cwd(), 'uploads/files', filename)
		fs.writeFileSync(filePath, buffer)
		return filename
	}
}
