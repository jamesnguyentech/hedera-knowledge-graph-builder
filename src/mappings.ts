/*
 * Hedera Subgraph Example
 *
 * Copyright (C) 2021 - 2022 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { GreetingSet} from '../generated/Greeter/IGreeter';
import {Greeting} from "../generated/schema";
import { Transfer } from "../generated/MyDataSource/MyContract";
import { TransactionEntity } from "../generated/schema";

export function handleTransfer(event: Transfer): void {
  // Create a unique ID for the transaction using the transaction hash and log index
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  // Create a new TransactionEntity instance with the generated ID
  let transaction = new TransactionEntity(id);

  // Set the entity fields with data from the event
  transaction.from = event.params.from;
  transaction.to = event.params.to;
  transaction.value = event.params.value;
  transaction.timestamp = event.block.timestamp;

  // Save the entity to the store
  transaction.save();
}
export function handleGreetingSet(event: GreetingSet): void {
	// Entities can be loaded from the store using a string ID; this ID
	// needs to be unique across all entities of the same type
	let entity = Greeting.load(event.transaction.hash.toHexString());

	// Entities only exist after they have been saved to the store;
	// `null` checks allow to create entities on demand
	if (!entity) {
		entity = new Greeting(event.transaction.hash.toHex());
	}

	// Entity fields can be set based on event parameters
	entity.currentGreeting = event.params._greeting;

	// Entities can be written to the store with `.save()`
	entity.save();
}
