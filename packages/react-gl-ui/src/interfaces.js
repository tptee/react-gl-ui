// @flow

interface Updatable<Props, Container, UpdatePayload> {
  prepareUpdate(
    oldProps: Props,
    newProps: Props,
    rootContainerInstance: Container
  ): UpdatePayload,
  commitUpdate(
    updatePayload: UpdatePayload,
    oldProps: Props,
    newProps: Props
  ): void,
  commitMount(newProps: Props): void,
  getPublicInstance(): mixed
}

// TODO: text version of this interface
interface ManagesChildren {
  appendChild(child: Updatable<*>): void,
  insertBefore(child: Updatable<*>): void,
  removeChild(child: Updatable<*>): void
}

export interface HasFinalizers<Props, Container> {
  finalizeBeforeMount(
    type: string,
    props: Props,
    rootContainerInstance: Container
  ): boolean,
  finalizeBeforeRemoval(): void
}

// prettier-ignore
export type Element<Props, Container, UpdatePayload> =
  Updatable<Props, Container, UpdatePayload> & ManagesChildren;
