import React, { Component, ReactNode } from 'react';

import Copy from '@react-spectrum/s2/icons/Copy';
import Explosion from '@react-spectrum/s2/illustrations/gradient/generic2/Explosion';

import Toast from '../GlobalUI/Toast';

import { ActionButton, Button, ButtonGroup, Content, Heading, IllustratedMessage } from '../index';
import { style } from '../style' with { type: 'macro' };

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  isHoveringStackTrace: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isHoveringStackTrace: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // 既存のトーストをすべて消してから、エラートーストを表示
    Toast.clearAll();
    setTimeout(() => {
      Toast.negative('Oops, something went wrong', { timeout: 2000 });
    }, 100);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleCopyStackTrace = (): void => {
    if (this.state.errorInfo?.componentStack) {
      navigator.clipboard
        .writeText(this.state.errorInfo.componentStack)
        .then(() => {
          Toast.positive('Stack trace copied to clipboard');
        })
        .catch((err) => {
          console.error('Failed to copy stack trace:', err);
          Toast.negative('Failed to copy stack trace');
        });
    }
  };

  handleMouseEnterStackTrace = (): void => {
    this.setState({ isHoveringStackTrace: true });
  };

  handleMouseLeaveStackTrace = (): void => {
    this.setState({ isHoveringStackTrace: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          className={style({
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'screen',
            paddingX: 32,
            gap: 16,
            overflow: 'auto',
          })}
        >
          <IllustratedMessage orientation="horizontal" size="L">
            <Explosion />
            <Heading>エラーが発生しました</Heading>
            <Content>アプリケーションの実行中に予期しないエラーが発生しました。</Content>
            <ButtonGroup>
              <Button onPress={this.handleReload} variant="accent">
                最初からやりなおす
              </Button>
            </ButtonGroup>
          </IllustratedMessage>

          {this.state.error && (
            <div
              className={style({
                marginTop: 8,
                padding: 16,
                maxWidth: 600,
                width: 'full',
                borderRadius: 'lg',
                backgroundColor: 'gray-100',

                font: 'code',
                fontSize: 'body-sm',
                color: 'neutral-subdued',
              })}
            >
              <p
                className={style({
                  margin: 0,
                  marginBottom: 8,
                  fontWeight: 'extra-bold',
                })}
              >
                Error Message:
              </p>
              <p
                className={style({
                  margin: 0,
                  marginBottom: 16,
                  paddingX: 16,
                })}
              >
                {this.state.error.message}
              </p>

              {this.state.errorInfo && (
                <details>
                  <summary
                    className={style({
                      marginBottom: 8,
                      fontWeight: 'extra-bold',
                      cursor: 'pointer',
                    })}
                  >
                    Stack Trace
                  </summary>
                  <div
                    className={style({ position: 'relative' })}
                    onMouseEnter={this.handleMouseEnterStackTrace}
                    onMouseLeave={this.handleMouseLeaveStackTrace}
                  >
                    <pre
                      className={style({
                        font: 'code-xs',
                        backgroundColor: 'elevated',
                        borderRadius: 'sm',
                        overflow: 'auto',
                        maxHeight: 300,
                      })}
                    >
                      {this.state.errorInfo.componentStack}
                    </pre>
                    <div
                      className={buttonContainerStyles({
                        visibility: this.state.isHoveringStackTrace ? 'visible' : 'hidden',
                      })}
                    >
                      <ActionButton onPress={this.handleCopyStackTrace}>
                        <Copy />
                      </ActionButton>
                    </div>
                  </div>
                </details>
              )}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

const buttonContainerStyles = style({
  position: 'absolute',
  top: 8,
  right: 8,
  opacity: {
    visibility: { visible: 1, hidden: 0 },
  },
  transition: 'opacity',
  transitionDuration: '0.2s',
  transitionTimingFunction: 'in-out',
  pointerEvents: {
    visibility: { visible: 'auto', hidden: 'none' },
  },
});
