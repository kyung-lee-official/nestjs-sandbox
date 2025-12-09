import MyEventService from "./service";
import { Module } from "@medusajs/framework/utils";

export default Module("my-event", {
	service: MyEventService,
});
