use anchor_lang::prelude::*;

use crate::constants::TASK_SEED;
use crate::state::TaskAccount;

#[derive(Accounts)]
#[instruction(task_id: u64)]
pub struct UpdateTask<'info> {
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [
            TASK_SEED,
            authority.key().as_ref(),
            task_id.to_le_bytes().as_ref()
        ],
        bump,
        has_one = authority,
        constraint = task.task_id == task_id
    )]
    pub task: Account<'info, TaskAccount>,
}

pub fn handle_update_task(
    ctx: Context<UpdateTask>,
    task_id: u64,
    title: String,
    description: String,
) -> Result<()> {
    let task = &mut ctx.accounts.task;

    task.title = title;
    task.description = description;

    Ok(())
}
