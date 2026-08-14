declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface SlotMap {
        /**
         * The input selector context-chip hole: feature chips rendered right
         * after the workspace selector. Session-maybe: entries stay mounted
         * without a session and hide themselves when their data source is absent.
         */
        'conversation.input.selector.context': {
            kind: 'list';
            scope: 'session-maybe';
            owner: InputSelectorContextOwnerProps;
        };
    }
    /** Owner share of the input selector context-chip hole (empty by contract). */
    interface InputSelectorContextOwnerProps {
    }
}
export {};
