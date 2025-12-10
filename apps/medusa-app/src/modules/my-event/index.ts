import { Module } from "@medusajs/framework/utils";
import MyEventService from "./service";

export default Module("my-event", {
  service: MyEventService,
});
