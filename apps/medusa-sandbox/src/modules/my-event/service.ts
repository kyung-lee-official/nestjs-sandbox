import {
	AbstractEventBusModuleService,
	MedusaError,
} from "@medusajs/framework/utils";
import { Message } from "@medusajs/types";

class MyEventService extends AbstractEventBusModuleService {
	protected groupedEventsMap_: Map<string, Message[]>;

	constructor() {
		// @ts-ignore
		super(...arguments);
		this.groupedEventsMap_ = new Map();
	}

	async emit<T>(
		data: Message<T> | Message<T>[],
		options: Record<string, unknown>
	): Promise<void> {
		const events = Array.isArray(data) ? data : [data];

		for (const event of events) {
			console.log(
				`Received the event ${event.name} with data ${event.data}`
			);

			if (!event.metadata) {
				throw new MedusaError(
					MedusaError.Types.INVALID_DATA,
					"Event metadata must be defined"
				);
			}

			if (event.metadata.eventGroupId) {
				const groupedEvents =
					this.groupedEventsMap_.get(event.metadata.eventGroupId) ||
					[];

				groupedEvents.push(event);

				this.groupedEventsMap_.set(
					event.metadata.eventGroupId,
					groupedEvents
				);
				continue;
			}

			// TODO push the event somewhere
		}
	}

	async releaseGroupedEvents(eventGroupId: string): Promise<void> {
		const groupedEvents = this.groupedEventsMap_.get(eventGroupId) || [];

		for (const event of groupedEvents) {
			const { options, ...eventBody } = event;
			// TODO emit event
		}
	}

	async clearGroupedEvents(eventGroupId: string): Promise<void> {
		const groupedEvents = this.groupedEventsMap_.get(eventGroupId) || [];

		for (const event of groupedEvents) {
			const { options, ...eventBody } = event;

			// TODO emit event
		}

		await this.clearGroupedEvents(eventGroupId);
		this.groupedEventsMap_.delete(eventGroupId);
	}
}

export default MyEventService;
