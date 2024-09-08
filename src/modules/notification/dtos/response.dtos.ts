import { ApiProperty } from '@nestjs/swagger'
import { PaginationResponseDto } from '../../../common'
import { NotificationGetAllResponse, NotificationGetOneResponse, ShopNotification } from '../interfaces'
import { ShopGetOneResponse } from '../../shop/interfaces'
import { ShopGetOneResponseDto } from '../../shop/dtos'

export class ShopNotificationDto implements ShopNotification {
	@ApiProperty({ type: String })
	id: string

	@ApiProperty({ type: String })
	read: boolean

	@ApiProperty({ type: ShopGetOneResponseDto })
	shop: ShopGetOneResponse
}

export class NotificationGetOneResponseDto implements NotificationGetOneResponse {
	@ApiProperty({ type: String })
	id: string

	@ApiProperty({ type: String })
	subtitle: string

	@ApiProperty({ type: String })
	title: string

	@ApiProperty({ type: ShopNotificationDto, isArray: true })
	shops: ShopNotification[]

	@ApiProperty({ type: Date, example: new Date() })
	createdAt: Date
}
export class NotificationGetAllResponseDto extends PaginationResponseDto implements NotificationGetAllResponse {
	@ApiProperty({ type: NotificationGetOneResponseDto, isArray: true })
	data: NotificationGetOneResponse[]
}
