/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { configApiRef, errorApiRef, useApi } from '@backstage/core';
import { Button } from '@material-ui/core';
import React from 'react';
import { catalogApiRef } from '../../plugin';

type Props = {
  catalogIsEmpty: boolean;
  onAdded: () => void;
};

export const AddExampleEntitiesButton = ({
  catalogIsEmpty,
  onAdded,
}: Props) => {
  const configApi = useApi(configApiRef);
  const catalogApi = useApi(catalogApiRef);
  const errorApi = useApi(errorApiRef);

  const addMockData = async () => {
    try {
      const promises: Promise<unknown>[] = [];
      const root = configApi.getConfig('catalog.exampleEntityLocations');
      for (const type of root.keys()) {
        for (const target of root.getStringArray(type)) {
          promises.push(catalogApi.addLocation({ target }));
        }
      }
      await Promise.all(promises);
      onAdded();
    } catch (err) {
      errorApi.post(err);
    }
  };

  return (
    <>
      {catalogIsEmpty && configApi.has('catalog.exampleEntityLocations') && (
        <Button variant="outlined" color="primary" onClick={addMockData}>
          Add example components
        </Button>
      )}
    </>
  );
};